require('./server');

const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const request = require('request');
const reload = require('electron-reload');
const conf = require('./config.json');

reload(__dirname);

let intervalValue = '';
Menu.setApplicationMenu(null);

const createWindow = () => {
  let left = 0;

  request(`${conf.requestURL}/api/getScreen?id=${conf.id}`, (err, result) => {
    if (err || result.length === 0 || !result?.body) return console.log(err || '17 Line Error');
    if (result?.body) result = JSON.parse(result?.body);  

    result?.forEach(item => {
      console.log(item);
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

setInterval(() => intervalFn(), 5 * 1000);