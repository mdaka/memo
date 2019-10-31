// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const NotifProcess = require('../src/notif_process');
const _path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const notificationsListPath = _path.join(__dirname, 'data.json');

let mainWindow;
let notifProcess;

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 600,
    maxWidth: 750,
    minHeight: 600,
    width: 700,
    height: 620,
    icon: `../${__dirname}/assets/png/64x64.png`,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Load the index.html of the app.
  mainWindow.loadFile('public/control_panel.html')
  // mainWindow.loadURL('http://localhost:3000')
  
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'معلومات إضافية',
          click () { 
            require('electron').openExternalSync('https://electronjs.org');
          }
        }
      ]
    }
  ];

  // If operating system is Mac
  if(process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: []},
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          {role: 'startspeaking'},
          { role: 'stopspeaking'}
        ]
      }
    );

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('window is closed...');
    mainWindow = null
  });

  mainWindow.on('restore', function(){
    
  });
}


function initEventsOfWindow() {
    mainWindow.webContents.on('crashed', function (event) { 

        console.log('Window Crashed event occured...');
    });

    mainWindow.on('unresponsive', function (event) {
        console.log('Window unresponsive event occured...');
    });

    
}

function whenWindowLoadedGetUpdated(statusNumber, notifications, minutesPeriodValue){
  
  mainWindow.webContents.on('did-finish-load', () => {

    mainWindow.webContents.send('onFirstLoad_currentOnOffStatus', statusNumber);
    
    mainWindow.webContents.send('onFirstLoad_showNotificationItems', notifications);

    mainWindow.webContents.send('onFirstLoad_showNotificationTimer', minutesPeriodValue);

  });
}

process.on('uncaughtException', (error, origin) => {
    
    // Log this to local file that can be synchrnozied with external service instead of using: console.error('Exception:', error);
    console.error('Exception:', error);
    
    process.exit(1);
});


function getNotifProcessInstance(){
  if(notifProcess == null){
    notifProcess = new NotifProcess(notificationsListPath);
  }

  return notifProcess;
}

function mainEntry(){
  // console.log(app.getPath('userData'));
  const notifProcess = getNotifProcessInstance();

  createWindow();
  initEventsOfWindow();
  whenWindowLoadedGetUpdated(notifProcess.getOnOffStatus(), notifProcess.getNotifications(), notifProcess.getMinutesPeriodValue());

  // Run the notification logic
  notifProcess.play();
  
}



ipcMain.on('event_periodChanged', function(event, minutesPeriod){
    minutesPeriod = parseInt(minutesPeriod);
    var status = notifProcess.updateNotifPeriod(minutesPeriod);
    event.returnValue = status;
});


ipcMain.on('event_onoffChanged', function(event, statusNumber){
    
    var status = notifProcess.updateOnOffStatus(statusNumber);
    // notifProcess.play();
    event.returnValue = status;
});




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', mainEntry)


// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
      app.quit();
  }

});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainEntry();
  }

});