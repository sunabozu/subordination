'use strict'

module.exports = function (fileUrl, apiPath, callback) {
	const fs = require('fs')
	const request = require('request')

	let file = fs.createWriteStream(apiPath)
	let current_progress = 0

	const req = request({
		method: 'GET',
		uri: fileUrl,
		timeout: 20000,
		followAllRedirects: false
	})

	req.pipe(file)

	req.on('response', (data) => {
		callback({type: 'start', size: parseInt(data.headers['content-length'])})
	})

	req.on('data', (chunk) => {
		current_progress += chunk.length
		callback({type: 'progress', current: current_progress})
	})

	req.on('end', () => {
		callback({type: 'done'})
	})

	req.on('error', (err) => {
		callback({type: 'error', description: err})
	})
}
