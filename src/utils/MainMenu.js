'use strict'

import {remote, shell} from 'electron'


let instance = null
let mainMenu = null

let registry = {}

export function enableItems(items) {
	for(let item of items) {
		// console.log(item.name, item.enabled)
		if(registry[item.name]) {
			registry[item.name].enabled = item.enabled
		}
	}
}

function go(command) {
	console.log('go')
	// ignore menu commands when any modal is open
	if(window.modalStack && window.modalStack.length > 0) {
		shell.beep()
		return
	}

	switch(command) {
		case 'preferences':
			instance.preferencesModalShown = true
			break

		case 'quit':
			remote.app.quit()
			break

		case 'about':
			instance.openAboutDialog()
			break

		case 'open':
			instance.onSetSubFile()
			break

		case 'load-video':
			instance.onSetVideoFile()
			break

		case 'save':
			instance.saveState()
			break

		case 'export':
			instance.onExport()
			break

		case 'export-as':
			instance.onExportAs()
			break

		case 'upload-to-ost':
			instance.onUploadToOst()
			break

		case 'close':
			instance.onCloseProject()
			break

		case 'add-new-title-after-current':
			instance.openNewTitleModal('after_current')
			break

		case 'add-new-title-at-end':
			instance.openNewTitleModal('end')
			break

		case 'capture-begin':
			instance.onCapture('begin')
			break

		case 'capture-finish':
			instance.onCapture('finish')
			break

		case 'capture-cancel':
			instance.onCapture('cancel')
			break

		case 'edit-current-title':
			instance.openNewTitleModal('edit')
			break

		case 'delete-current-title':
			instance.onDeleteTitle()
			break

		case 'reindex':
			instance.onReindexSubfile()
			break

		case 'shift':
			instance.openShiftModal()
			break

		case 'prev-title':
			instance.$broadcast('move-title', 'prev')
			break

		case 'next-title':
			instance.$broadcast('move-title', 'next')
			break

		case 'visit-website':
			shell.openExternal('http://subordination.cu.cc')
			break

		case 'report-bug':
			shell.openExternal('https://github.com/sunabozu/subordination/issues')
			break
	}
}

export function createApplicationMenu(vue_instance) {
	instance = vue_instance

	const Menu = remote.Menu
	const app_name = remote.app.getName()

	let item_preferences = {
		label: 'Preferences...',
		accelerator: process.platform == 'darwin' ? 'Command+,' : 'CmdOrCtrl+P',
		click() { go('preferences') }
	}

	let item_quit = {
		label: 'Quit',
		accelerator: 'CmdOrCtrl+Q',
		click() { go('quit') }
	}

	let item_about = {
		label: `About ${app_name}...`,
		role: 'about',
		click() { go('about') }
	}

	let item_save = {
		label: 'Save',
		accelerator: 'CmdOrCtrl+S',
		// role: 'save',
		click() { go('save') }
	}

	let menu_file = {
		label: 'File',
		submenu: [
			{
				label: 'Open...',
				accelerator: 'CmdOrCtrl+O',
				click() { go('open') }
			},
			{
				label: 'Load video file...',
				accelerator: 'Shift+CmdOrCtrl+V',
				click() { go('load-video') }
			},
			{
				type: 'separator'
			},
			item_save,
			{
				label: 'Export',
				accelerator: 'CmdOrCtrl+E',
				click() { go('export') }
			},
			{
				label: 'Export as...',
				accelerator: 'Shift+CmdOrCtrl+E',
				click() { go('export-as') }
			},
			{
				label: 'Upload to Opensubtitles.org',
				accelerator: 'CmdOrCtrl+U',
				click() { go('upload-to-ost') },
				enabled: instance.$store.state.ost.verified
			},
			{
				type: 'separator'
			},
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				click() { go('close') }
			}
		]
	}

	let menu_edit = {
		label: 'Edit',
		submenu: [
			{
				label: 'Undo',
				accelerator: 'CmdOrCtrl+Z',
				role: 'undo'
			},
			{
				label: 'Redo',
				accelerator: 'Shift+CmdOrCtrl+Z',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label: 'Cut',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: 'Copy',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: 'Paste',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			},
			{
				label: 'Select All',
				accelerator: 'CmdOrCtrl+A',
				role: 'selectall'
			},
			{
				type: 'separator'
			},
			{
				label: 'Add a new title',
				submenu: [
					{
						label: 'after the current one...',
						accelerator: 'CmdOrCtrl+N',
						click() { go('add-new-title-after-current') }
					},
					{
						label: 'at the end of the list...',
						accelerator: 'CmdOrCtrl+Shift+N',
						click() { go('add-new-title-at-end') }
					}
				]
			},
			{
				label: 'Capture from the timeline',
				submenu: [
					{
						label: 'begin',
						accelerator: 'CmdOrCtrl+1',
						click() { go('capture-begin') }
					},
					{
						label: 'finish...',
						accelerator: 'CmdOrCtrl+2',
						click() { go('capture-finish') }
					},
					{
						label: 'cancel',
						accelerator: 'CmdOrCtrl+3',
						click() { go('capture-cancel') }
					},
				]
			},
			{
				label: 'Edit current title',
				accelerator: 'CmdOrCtrl+I',
				click() { go('edit-current-title') }
			},
			{
				label: 'Delete current title',
				accelerator: 'CmdOrCtrl+D',
				click() { go('delete-current-title') }
			},
			{
				label: 'Reindex titles',
				click() { go('reindex')	}
			},
			{
				label: 'Shift titles...',
				click() { go('shift') }
			}
		]
	}

	let menu_view = {
		label: 'View',
		submenu: [
			{
				label: 'Previous title',
				accelerator: process.platform == 'darwin' ? 'Command+K' : 'Ctrl+K',
				click() { go('prev-title') }
			},
			{
				label: 'Next title',
				accelerator: process.platform == 'darwin' ? 'Command+J' : 'Ctrl+J',
				click() { go('next-title')	}
			},
		]
	}

	if(process.env.APP_DEBUG == 1) {
		menu_view.submenu.push({
			type: 'separator'
		})
		menu_view.submenu.push({
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click: function(item, focusedWindow) {
				if (focusedWindow)
					focusedWindow.reload()
			}
		})
		menu_view.submenu.push({
			label: 'Toggle Developer Tools',
			accelerator: (function() {
				if (process.platform == 'darwin')
					return 'Alt+Command+I'
				else
					return 'Ctrl+Shift+I'
			})(),
			click: function(item, focusedWindow) {
				if (focusedWindow)
					focusedWindow.toggleDevTools()
			}
		})
	}

	let menu_window = {
		label: 'Window',
		role: 'window',
		submenu: [
			{
				label: 'Minimize',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
		]
	}

	let menu_help = {
		label: 'Help',
		role: 'help',
		submenu: [
			{
				label: 'Visit the website...',
				click() { go('visit-website') }
			},
			{
				label: 'Report a bug...',
				click() { go('report-bug') }
			},
		]
	}

	if(process.platform == 'win32') {
		menu_file.submenu.splice(7, 0, item_preferences)
		menu_file.submenu.splice(8, 0, {type: 'separator'})
	}

	if(process.platform != 'darwin') {
		menu_file.submenu.push(item_quit)

		menu_help.submenu.splice(1, 0, item_about)
	}

	const template = [
		menu_file,
		menu_edit,
		menu_view,
		menu_window,
		menu_help,
	]

	let index = 0 // index of the File menu

	if(process.platform == 'darwin') {
		index = 1

		template.unshift({
			label: name,
			submenu: [
				item_about,
				{
					type: 'separator'
				},
				item_preferences,
				{
					type: 'separator'
				},
				{
					label: 'Services',
					role: 'services',
					submenu: []
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide ' + app_name,
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				item_quit,
			]
		})

		// Window menu.
	  template[4].submenu.push(
	    {
	      type: 'separator'
	    },
	    {
	      label: 'Bring All to Front',
	      role: 'front'
	    }
	  )
	}

	mainMenu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(mainMenu)

	// file
	registry['load-video'] = mainMenu.items[index].submenu.items[1]
	registry['save'] = mainMenu.items[index].submenu.items[3]
	registry['export'] = mainMenu.items[index].submenu.items[4]
	registry['export-as'] = mainMenu.items[index].submenu.items[5]
	registry['upload-to-ost'] = mainMenu.items[index].submenu.items[6]
	registry['close'] = mainMenu.items[index].submenu.items[8]

	// edit
	registry['add-new-title-after-current'] = mainMenu.items[index + 1].submenu.items[8].submenu.items[0]
	registry['add-new-title-at-end'] = mainMenu.items[index + 1].submenu.items[8].submenu.items[1]
	registry['capture-begin'] = mainMenu.items[index + 1].submenu.items[9].submenu.items[0]
	registry['capture-finish'] = mainMenu.items[index + 1].submenu.items[9].submenu.items[1]
	registry['capture-cancel'] = mainMenu.items[index + 1].submenu.items[9].submenu.items[2]
	registry['edit-current-title'] = mainMenu.items[index + 1].submenu.items[10]
	registry['delete-current-title'] = mainMenu.items[index + 1].submenu.items[11]
	registry['reindex'] = mainMenu.items[index + 1].submenu.items[12]
	registry['shift'] = mainMenu.items[index + 1].submenu.items[13]

	// view
	registry['prev-title'] = mainMenu.items[index + 2].submenu.items[0]
	registry['next-title'] = mainMenu.items[index + 2].submenu.items[1]

	return mainMenu
}
