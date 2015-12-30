const electron = require('electron');
const app = require('app');							// Module to control application life.
const BrowserWindow = require('browser-window');	// Module to create native browser window.
const Menu = electron.Menu;
const Tray = electron.Tray;

var mainWindow = null;

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
		frame: false,
		autoHideMenuBar: true,
		skipTaskbar: true,
	});

	var bounds = mainWindow.getBounds(), w = 310;
	mainWindow.setBounds({
		y: 0,
		x: bounds.width + bounds.x - w,
		width: w,
		height: bounds.height
	});

	// tray icon
	var appIcon = new Tray('assets/satelite-tray.png');
	var contextMenu = Menu.buildFromTemplate([
		{ label: 'Satelite', type: 'normal', enabled: false },
		{ type: 'separator' },
		{ label: 'Quit', type: 'normal', click: function () { mainWindow.close(); }}
	]);
	appIcon.setToolTip('Satelite');
	appIcon.setContextMenu(contextMenu);


	setTimeout(function () {
		mainWindow.loadURL('file://' + __dirname + '/assets/app.html');
	}, 100);


	mainWindow.on('closed', function () { mainWindow = null; });
});

app.on('window-all-closed', function () { app.quit(); });
