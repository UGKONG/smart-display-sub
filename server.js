'use strict';
const conf = require('./config.json');
const express = require('express');
const { SerialPort } = require('serialport');
const ipc = require('electron').ipcMain;
const multer = require('multer');
const fs = require("fs-extra");
const app = express();
const upload = multer({dest: 'build/files/'});
const { mw } = require('request-ip');

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
// 리소스 폴더 main_dev 쪽 Root에 복사
app.get('/api/build', (req, res) => {
  fs.copy(__dirname + '/build', __dirname + '/../main_dev/resources', function (err) {
    if (err) return res.send('Fail');
    res.send('Success');
  });
});

// serial
app.put('/serialPortOn', () => toggleSerialPort(true));
app.put('/serialPortOff', () => toggleSerialPort(false));

app.get('*', (req, res) => res.send('페이지를 찾을 수 없습니다.'));

// Start
app.listen(80, () => {
  console.log(`No.${conf.id} Hardware ON.`);
});