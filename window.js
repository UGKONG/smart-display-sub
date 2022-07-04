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

    let fileNameList = [];
    let isFiles = true;
    data?.forEach(item => item?.MEDIA_URL && fileNameList.push(item?.MEDIA_URL));
    fileNameList?.forEach(async item => {
      let isTrue = await fs.existsSync(__dirname + '/build/files/' + item);
      if (!isTrue) {
        isFiles = false;
        let url = conf.requestURL + '/files/' + item;
        let file = await axios.get(url, { responseType: 'arraybuffer' });

        await fs.writeFileSync(__dirname + '/build/files/' + item, file?.data);
      }
    });
    
    if (!isFiles) {
      console.log('리소스 파일이 변경되어 재실행합니다.');
      app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
      app.quit();
      return;
    }
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