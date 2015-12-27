const app = require('app'); // Module to control application life.
const BrowserWindow = require('browser-window'); // Module to create native browser window.
const electron = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
	var screenSize = electron.screen.getPrimaryDisplay().workAreaSize;

	// Create the browser window.
	mainWindow = new BrowserWindow({
		x: 0,
		y: 0,
		width: screenSize.width,
		height: screenSize.height,
		icon:'assets/satelite.png',
		transparent: true,
		frame: false
	});

	var bounds = mainWindow.getBounds(), w = 310;
	mainWindow.setBounds({
		y: 0,
		x: bounds.width + bounds.x - w,
		width: w,
		height: bounds.height
	});


	setTimeout(function () {
		mainWindow.loadURL('file://' + __dirname + '/assets/app.html');
	}, 100);


	mainWindow.on('closed', function () { mainWindow = null; });
});
