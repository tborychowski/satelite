'use strict';

const electron = require('electron');
const app = require('app');							// Module to control application life.
const BrowserWindow = require('browser-window');	// Module to create native browser window.
const Menu = electron.Menu;
const Tray = electron.Tray;

let mainWindow = null;

app.on('ready', () => {
	let screenSize = electron.screen.getPrimaryDisplay().workAreaSize;

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
	mainWindow.on('closed', () => mainWindow = null);

	let bounds = mainWindow.getBounds(), width = 310;
	mainWindow.setBounds({
		y: 0,
		x: bounds.width + bounds.x - width,
		width,
		height: bounds.height
	});

	// tray icon
	let appIcon = new Tray('assets/satelite-tray.png');
	let contextMenu = Menu.buildFromTemplate([
		{ label: 'Satelite', type: 'normal', enabled: false },
		{ type: 'separator' },
		{ label: 'Quit', type: 'normal', click: mainWindow.close }
	]);
	appIcon.setToolTip('Satelite');
	appIcon.setContextMenu(contextMenu);

	setTimeout(() => mainWindow.loadURL('file://' + __dirname + '/assets/app.html'), 100);
});

app.on('window-all-closed', app.quit);
