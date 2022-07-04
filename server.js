'use strict';
const conf = require('./config.json');
const express = require('express');
const { SerialPort } = require('serialport');
const ipc = require('electron').ipcMain;
const multer = require('multer');
const fs = require('fs');
const app = express();
const upload = multer({dest: __dirname + '/build/files/'});
const { mw } = require('request-ip');
const axios = require('axios');
const AdmZip = require('adm-zip');
const request = require('request');
const intervalTime = 10000;

const port = new SerialPort(conf.serial, (err) => {
  err && console.log('Serial Port connection fail');
});

const toggleSerialPort = (onoff = false) => {
  port.write(onoff ? 'O' : 'F', err => {
    if (err) console.log('Serial Port communication fail');
  });
}
const ip = (currentIp) => {
  if (currentIp.indexOf('::ffff') > -1) return currentIp?.split('::ffff:')[1];
  if (currentIp.indexOf('::') > -1) return currentIp?.split('::')[1];
  return currentIp;
}

// 미들웨어
app.use(mw());
app.use('/api/getIp', (req, res) => {
  let ip = req.clientIp;
  if (ip.indexOf('::ffff') > -1) return res.send(ip?.split('::ffff:')[1]);
  if (ip.indexOf('::') > -1) return res.send(ip?.split('::')[1]);
  res.end(ip);
});
app.get('/api/getIp', (req, res) => res.send(getClientIp(req)));
app.use('/public/files/', express.static(__dirname + '/build/files/'));
app.use('/:id', express.static(__dirname + '/build'));


// POST
app.post('/closeApp', () => ipc.emit('closeApp'));
app.post('/reloadApp', () => ipc.emit('reloadApp'));
app.post('/api/upload/' + conf.id, upload.fields([{ name: 'ip' }, { name: 'files' }]), (req, res) => {
  res.send({ ip: ip(req.ip), files: req.files});
});


// Start
app.listen(80, () => console.log('No.' + conf.id +  'Hardware ON.'));

// 중앙 서버의 리소스로 업데이트
app.get('/api/update', (req, res) => {
  axios({ 
    url: conf.requestURL + '/api/resource',
    responseType: 'arraybuffer',
  }).then(({ data }) => {
    let isSuccess = true;
    if (!data) return res.send(false);
    const toPath = __dirname + '/build/temp/';
    const targetPath = toPath + '../';
    !fs.existsSync(toPath) && fs.mkdirSync(toPath);
    fs.writeFile(toPath + 'build.zip', data, (err) => {
      if (err) isSuccess = false;

      const zip = new AdmZip(toPath + 'build.zip');
      zip.extractAllToAsync(targetPath, true, undefined, (err) => {
        if (err) isSuccess = false;
        fs.unlink(toPath + 'build.zip', (err) => {
          if (err) isSuccess = false;
          fs.rmdir(targetPath + 'temp', (err) => {
            if (err) isSuccess = false;
            res.send(isSuccess);
          });
        });
      });
    });
  });
  
});
app.get('/test', (req, res) => res.send('I am test'));

// serial
app.put('/serialPortOn', () => toggleSerialPort(true));
app.put('/serialPortOff', () => toggleSerialPort(false));

app.get('*', (req, res) => res.send('페이지를 찾을 수 없습니다.'));

const update = adminVersion => {
  console.log('업데이트를 진행합니다.');
  request(conf.loadURL + '/api/update', (err, result) => {
    err && console.log('error', err);
    let isSuccess = JSON.parse(result?.body) ? 1 : 0;
    console.log('업데이트 ' + (isSuccess ? '성공' : '실패') + '하였습니다.');
    if (isSuccess === 0) return;
    axios.put(`
      ${conf.requestURL}/api/hardwareUpdate/
      ${conf.id}/${adminVersion}/${isSuccess}
    `);
  });
}

const updateCheckFn = () => {
  request(`${conf.requestURL}/api/updateInfo/${conf.id}`, (err, result) => {
    if (err) return console.log(err);
    let body = result?.body;
    if (body?.indexOf('<') > -1) return;
    let data = JSON.parse(body);
    let { admin, hardware } = data;
    admin = admin?.VERSION;
    hardware = hardware?.VERSION;
    if (!admin) return;
    admin > hardware && update(admin);
  })
}

updateCheckFn();
setInterval(() => updateCheckFn(), intervalTime);
