'use strict'

module.exports = function() {
	try {
		if(process.platform == 'darwin' || process.platform == 'win32') {
			const remote = require('electron').remote
			const path = require('path')
			const fs = require('fs')

			// check if the version is correct
			const data = fs.readFileSync(path.join(remote.app.getPath('appData'), remote.app.getName(), 'wc_version.txt'), 'utf8')
			console.log(data, remote.app.WC_VERSION)
			if(data != remote.app.WC_VERSION) {
				const err = `The version of Webchimera is wrong. Expected ${remote.app.WC_VERSION}, but got ${data}`
				const notifier = require('node-notifier')
				notifier.notify({title: 'Error', message: err})
				throw new Error(err)
			} else { // success
				console.log('success')
				return require(path.join(remote.app.getPath('appData'), remote.app.getName(), 'webchimera.js'))
			}
		} else { // on linux we rely on the system version of libvlc
			return require('webchimera.js')
		}
	} catch(e) {
		console.error(e)
		return null
	}
}
