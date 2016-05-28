'use strict'

// import {remote} from 'electron'
const dialog = require('electron').remote.dialog
const remote = require('electron').remote


const showMsg = function(type, msg, detail) {
	const win = remote.getCurrentWindow()

	try {
		dialog.showMessageBox(win, {
			type,
			buttons: ['Ok'],
			defaultId: 0,
			title: 'Error',
			message: msg,
			detail: detail,
		})
	} catch(e) {
		console.log(e)
	}
}

export default {
	warning(msg, detail) {
		showMsg('error', msg, detail)
	},

	error(msg, detail) {
		showMsg('error', msg, detail)
	}
}
