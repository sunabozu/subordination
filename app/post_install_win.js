'use strict'

const fs = require('fs')
const path = require('path')
const {spawn} = require('child_process')


const getUpdateDotExe = () => path.resolve(path.dirname(process.execPath), '..', 'update.exe')

module.exports = {
	afterInstall: (app) => {
		const path_to_reg_file = path.join(path.dirname(process.execPath), 'add_reg_keys.reg')
		const updateDotExe = getUpdateDotExe()

		fs.readFile(path_to_reg_file, 'utf-8', (err, reg_file_content) => {
			reg_file_content = reg_file_content.replace('@exe_path', updateDotExe.replace(/([\\\s"])/g, '\\$1'))

			fs.writeFile(path_to_reg_file, reg_file_content, 'utf-8', () => {

				spawn('reg', ['import', path_to_reg_file], {detached: true})
					.on('close', () => {
						// create shortcuts
						spawn(updateDotExe, ['--createShortcut',  path.basename(process.execPath)], {detached: true})
							.on('close', () => app.quit())
					})
			})
		})
	},

	beforeUninstall: (app) => {
		const path_to_reg_file = path.join(path.dirname(app.getPath('exe')), 'remove_reg_keys.reg')
		spawn('reg', ['import', path_to_reg_file], {detached: true})
			.on('close', () => {
				// delete shortcuts
				const updateDotExe = getUpdateDotExe(app)
				spawn(updateDotExe, ['--removeShortcut', path.basename(process.execPath)], {detached: true})
					.on('close', () => app.quit())
			})
	}
}
