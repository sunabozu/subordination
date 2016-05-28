'use strict'

const electron = require('electron')
const {app, shell, BrowserWindow} = electron
let mainWindow = null
let aboutWin = null
let updater = null

// handle Squirrel startup/uninstall events on Windows
if(process.platform == 'win32') {
	const handleStartupEvent = () => {
		const cmd_arg = process.argv.length > 1 ? process.argv[1] : null
		if(!cmd_arg)
			return false

		switch(cmd_arg) {
			case '--squirrel-install':
				require('./post_install_win.js').afterInstall(app)
				return true

			case '--squirrel-uninstall':
				require('./post_install_win.js').beforeUninstall(app)
				return true

			case '--squirrel-updated':
			case '--squirrel-obsolete':
				return true

			case '--squirrel-firstrun':
				require('./post_install_win.js').createShortcut(app)
				app.first_run = true
				return false

			default: // in case the user opens an srt file directly
				if(cmd_arg != './app')
					app.cmd_arg = cmd_arg
				return false
		}
	}

	if(handleStartupEvent())
		app.quit()
}

// handle the 'open with' option on Mac
app.on('open-file', (e, path) => {
	app.cmd_arg = path
	// TODO send a message to the window
})

// force single instance on Windows and in some cases on Mac
// react on 'open with' events
const should_quit = app.makeSingleInstance((argv) => {
	if(argv.length > 1 && mainWindow) {
		if(mainWindow.isMinimized())
			mainWindow.restore()

		mainWindow.focus()
		mainWindow.webContents.send('msg-bus', {type: 'open-with', file_path: argv[1]})
	}
})

if(should_quit)
	app.quit()

// const menu = electron.menu
const ipc = electron.ipcMain

const windowStateKeeper = require('electron-window-state')

const fs = require('fs')
const path = require('path')
// const shell = electron.shell

app.commandLine.appendSwitch('enable-transparent-visuals')
app.WC_VERSION = '0.2.3'

app.on('ready', () => {
	const winPos = new windowStateKeeper({
		defaultWidth: 950,
    defaultHeight: 700
	})

	mainWindow = new BrowserWindow({
		width: winPos.width,
		height: winPos.height,
		minWidth: 860,
		minHeight: 380,
		frame: process.platform == 'win32' ? false : true,
		// transparent: true,
		textAreasAreResizable: false,
		titleBarStyle: 'hidden-inset',
	})

	winPos.manage(mainWindow) // saves and restores window's position

	mainWindow.on('closed', () => {
		app.quit()
	})

	function saveSubfile(folder, name, data) {
		fs.writeFile(path.join(folder, 'projects', `${name}.json`), data, 'utf8',
			err => {
				if(err)
					console.log(err)
				else
					console.log('The subfile is saved')
			})
	}

	function loadJson(folder, name) {
		return new Promise((resolve, reject) => {
			fs.readFile(path.join(folder, 'projects', `${name}.json`), 'utf8', function(err, data) {
				if(err) {
					reject(err)
				} else {
					resolve(JSON.parse(data))
				}
			})
		})
	}

	function loadSubfile(folder, name) {
		loadJson(folder, name)
			.then(resp => {
				console.log('Subfile is loaded')
				mainWindow.webContents.send('msg-bus', {subfile: resp, type: 'subfile-loaded'})
			})
			.catch(err => {
				console.log(err)
			})
	}

	const appDataPath = path.join(app.getPath('appData'), app.getName())
	console.log(appDataPath)

	// required by Electron v0.36 on Windows
	if(process.platform == 'win32')
		process.env['VLC_PLUGIN_PATH'] = path.join(appDataPath, 'webchimera.js/plugins')

	if(!fs.existsSync(appDataPath))
		fs.mkdirSync(appDataPath)

	if(!fs.existsSync(path.join(appDataPath, 'projects')))
		fs.mkdirSync(path.join(appDataPath, 'projects'))

		// app.commandLine.appendSwitch('js-flags', '--harmony-modules')

		mainWindow.loadURL(`file://${__dirname}/mainWindow.html`)
		console.log(process.env.APP_DEBUG)
		if(process.env.APP_DEBUG == 1)
			mainWindow.openDevTools()

		mainWindow.webContents.on('did-finish-load', () => {
			// load state from disk
			fs.readFile(path.join(appDataPath, 'state.json'), 'utf8', function(err, data) {
				// let result = null

				if(err) {
					console.log(err)
				} else {
					console.log('State is loaded')
					try {
						// result = JSON.parse(data)
					} catch(e) {
						console.log('cannot parse the state:', e)
						// return
					}
				}

				mainWindow.webContents.send('msg-bus', {state: data, type: 'state-loaded'})
			})

			// if the user dropped a file on the dock icon on Mac
			app.on('open-file', (e, file_path) => {
				mainWindow.webContents.send('msg-bus', {type: 'open-with', file_path})
			})

			// check for updates
			const ghr = require('electron-gh-releases')
			updater = new ghr({
				repo: 'sunabozu/subordination',
				currentVersion: app.getVersion()
			})

			updater.check((err, status) => {
				if(err) {
					console.log(err)
					return
				}

				console.log('status:', status)

				if(status)
					updater.download()
			})

			updater.on('update-downloaded', (info) => {
				if(mainWindow)
					mainWindow.webContents.send('msg-bus', {type: 'update-ready'})
			})
		})

		mainWindow.on('blur', () => {
			mainWindow.webContents.send('msg-bus', {type: 'window-active', data: false})
		})

		mainWindow.on('focus', () => {
			mainWindow.webContents.send('msg-bus', {type: 'window-active', data: true})
		})

		mainWindow.on('maximize', () => {
			mainWindow.webContents.send('msg-bus', {type: 'window-maximized', data: true})
		})

		mainWindow.on('unmaximize', () => {
			mainWindow.webContents.send('msg-bus', {type: 'window-maximized', data: false})
		})

		// save current state
		ipc.on('msg-bus', (event, msg) => {
			switch(msg.type) {
				case 'save-state':
					console.log('saving state...')
					fs.writeFile(path.join(appDataPath, 'state.json'), msg.state, 'utf8',
						err => {
							if(err)
								console.log(err)
							else
								console.log('The state is saved')
		        })
					break

				case 'save-subfile':
					saveSubfile(appDataPath, msg.subfileName, msg.subfile)
					break

				case 'load-subfile':
					loadSubfile(appDataPath, msg.subfileName)
					break

				case 'save-file':
					fs.writeFile(msg.path, msg.content, 'utf8', err => {
						if(err) {
							// notifier.notify({title: 'Error', message: `subtitles couldn't be exported`})
							mainWindow.webContents.send('msg-bus', {type: 'subfile-exported', error: err})
							console.log(err)
							return
						}

						mainWindow.webContents.send('msg-bus', {type: 'subfile-exported', path: msg.path, silent: msg.silent})

						// if(!msg.silent)
						// 	notifier.notify({title: 'Subtitles are exported:', message: msg.path})
					})
					break

				case 'open-about-dialog':
					if(aboutWin)
						return

					aboutWin = new BrowserWindow({
						width: 280,
						height: 365,
						resizable: false,
						maximizable: false,
						minimizable: false,
						skipTaskbar: true,
						autoHideMenuBar: true,
						alwaysOnTop: true,
					})

					aboutWin.on('closed', () => {
						aboutWin = null
					})

					aboutWin.loadURL(`file://${app.getAppPath()}/aboutDialog.html`)
					aboutWin.webContents.on('new-window', (e, url) => {
						e.preventDefault()
						shell.openExternal(url)
						return false
					})
					break

				case 'install-update':
					if(updater)
						updater.install()
			}
		})
})
