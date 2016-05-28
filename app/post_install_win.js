'use strict'

const fs = require('fs')
const path = require('path')
const spawnSync = require('child_process').spawnSync


function getLnkPath(app) {
	return {
		menu_path: path.join(app.getPath('home'), `Start Menu\\Programs\\${app.getName()}.lnk`),
		desktop_path: path.join(app.getPath('desktop'), `${app.getName()}.lnk`)
	}
}

module.exports = {
	afterInstall: (app) => {
		const path_to_reg_file = path.join(path.dirname(app.getPath('exe')), 'add_reg_keys.reg')
		const app_path_raw = app.getPath('exe')
		const app_path = app_path_raw.replace(/([\\\s"])/g, '\\$1')

		let reg_file_content = fs.readFileSync(path_to_reg_file, 'utf-8')
		reg_file_content = reg_file_content.replace('@exe_path', app_path)
		fs.writeFileSync(path_to_reg_file, reg_file_content, 'utf-8')

		spawnSync('reg', ['import', path_to_reg_file])
	},

	createShortcut: (app) => {
		const ws = require('windows-shortcuts')
		const lnk = getLnkPath(app)
		const desc = 'a desktop app for translating and editing subtitles'

		ws.create(lnk.menu_path, {target: app.getPath('exe'), desc}, (err) => {
			if(!err) // copy the created shortcut to the Desktop folder
				fs.createReadStream(lnk.menu_path).pipe(fs.createWriteStream(lnk.desktop_path))
		})
	},

	beforeUninstall: (app) => {
		const path_to_reg_file = path.join(path.dirname(app.getPath('exe')), 'remove_reg_keys.reg')
		spawnSync('reg', ['import', path_to_reg_file])

		// delete shortcuts
		const lnk = getLnkPath(app)
		fs.unlinkSync(lnk.menu_path)
		fs.unlinkSync(lnk.desktop_path)
	}
}
