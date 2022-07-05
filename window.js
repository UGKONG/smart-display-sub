require('./server');

const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const request = require('request');
const reload = require('electron-reload');
const conf = require('./config.json');
const fs = require('fs');
const axios = require('axios');
const intervalTime = 5000;

reload(__dirname);

let intervalValue = '';
Menu.setApplicationMenu(null);

const createWindow = () => {
  let left = 0;

  request(`${conf.requestURL}/api/getScreen?id=${conf.id}`, (err, result) => {
    if (err || result.length === 0 || !result?.body) return console.log(err || '17 Line Error');
    if (result?.body) result = JSON.parse(result?.body);  

    result?.forEach(item => {
      let win = new BrowserWindow({
        x: left, y: 0, width: item?.WIDTH, height: item?.HEIGHT,
        alwaysOnTop: true, resizable: false, frame: false,
        backgroundColor: 'rgb(43, 42, 42)',
        webPreferences: { nodeIntegration: true }
      });
      win?.loadURL(conf.loadURL + item?.DEFAULT_PAGE);
      win?.on('closed', () => win = null);
      left += item?.WIDTH;
    });

  });
}

const intervalFn = () => {
  request(`${conf.requestURL}/api/pageControl?id=${conf.id}`, (err, result) => {
    let data = result?.body;
    if (err || !data) return console.log(err || 'data null');
    data = JSON.parse(data);

    // 디렉토리 체크
    let isDirectory = fs.existsSync(__dirname + '/build/files');
    !isDirectory && fs.mkdirSync(__dirname + '/build/files');

    let fileNameList = [];
    data?.forEach(item => item?.MEDIA_URL && fileNameList.push(item?.MEDIA_URL));
    fileNameList?.forEach(async item => {
      let name = item;
      let isHttp = name?.indexOf('http') > -1;
      if (isHttp) {
        name = name?.split('/');
        name = name[name?.length - 1];
      }
      
      let isTrue = await fs.existsSync(__dirname + '/build/files/' + name);
      if (!isTrue) {
        let url = isHttp ? item : (conf.requestURL + '/files/' + name);
        let file = await axios.get(url, { responseType: 'arraybuffer' });
        await fs.writeFileSync(__dirname + '/build/files/' + name, file?.data);
      }
    });
    data = JSON.stringify(data);

    if (intervalValue === '' || intervalValue === data) return intervalValue = data;

    console.log('페이지 컨트롤 정보가 변경되어 재실행합니다.');
    // reload
    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
    app.quit();
  });
}

// electron
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  console.log(`No.${conf.id} Hardware OFF.`);
  app.quit();
});
ipcMain.on('closeApp', () => {
  console.log(`No.${conf.id} Hardware OFF.`);
  app.quit();
});

setInterval(() => intervalFn(), intervalTime);