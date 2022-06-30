'use strict';
const conf = require('./config.json');
const express = require('express');
const { SerialPort } = require('serialport');
const ipc = require('electron').ipcMain;
const multer = require('multer');
const fs = require('fs');
const app = express();
const upload = multer({dest: 'build/files/'});
const { mw } = require('request-ip');
const axios = require('axios');
const AdmZip = require('adm-zip');
const request = require('request');
const intervalTime = 5000;

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
app.use('/now', express.static(__dirname + '/build'));
app.use('/today', express.static(__dirname + '/build'));
app.use('/tomorrow', express.static(__dirname + '/build'));
app.use('/week', express.static(__dirname + '/build'));
app.use('/text', express.static(__dirname + '/build'));
app.use('/dust', express.static(__dirname + '/build'));
app.use('/detailDust', express.static(__dirname + '/build'));
app.use('/image', express.static(__dirname + '/build'));
app.use('/video', express.static(__dirname + '/build'));
app.use('/logo', express.static(__dirname + '/build'));
app.use('/dev', express.static(__dirname + '/build'));

// Routes
app.get('/', (req, res) => res.redirect('/now'));
app.get('/api/getIp', (req, res) => res.send(getClientIp(req)));
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
        res.send(isSuccess);
      });
    });
  });
  
});
app.get('/test', (req, res) => res.send('I am test'));

// serial
app.put('/serialPortOn', () => toggleSerialPort(true));
app.put('/serialPortOff', () => toggleSerialPort(false));

app.get('*', (req, res) => res.send('페이지를 찾을 수 없습니다.'));

const update = () => {
  request(conf.loadURL + '/api/update', (err, result) => {
    if (err) {
      console.log('업데이트 실패');
      console.log(err);
      return;
    }

    JSON?.parse(result?.body) && console.log('업데이트 성공');
  });
}

const updateCheckFn = () => {
  request(`${conf.requestURL}/api/check`, (err, result) => {
    if (err) return console.log(err);
    fs.readFile(__dirname + '/build/temp/build.zip', (err, data) => {
      let beforeSize = (err || !data) ? 0 : Number(Buffer.byteLength(data));
      let body = result?.body;
      if (body?.indexOf('<') > -1) return;
      let afterSize = Number(JSON.parse(result?.body)?.size);
      if (beforeSize === afterSize) return;
      
      update();
    })
  })
}

setInterval(() => updateCheckFn(), intervalTime);
