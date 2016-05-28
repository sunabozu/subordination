'use strict'

import fs from 'fs'
import {str_to_dict} from './srt'


export default function(path, callback) {
	const stats = fs.statSync(path)
	if(!stats.isFile())
		return callback(`This file can't be open`)

	if(stats['size'] > 2000000)
		return callback(`The file is too big`)

	let result = []

	fs.readFile(path, 'utf8', (error, data) => {
		if(error) {
			callback(error)
			return
		}

		// const parser = str_to_dict(data)
		// parser.next()
		//
		// for(let item of parser) {
		// 	result.push(item)
		// }
		//
		// if(result.length < 5) // a subfile must contain at least 5 titles
		// 	return callback(`This is not a valid SubRip file`)
		//
		// callback(null, result)

		str_to_dict(data, (item, done) => {
			result.push(item)

			if(done) {
				if(result.length < 5)
					return callback(`This is not a valid SubRip file`)

				callback(null, result)
			}
		})
	})
}
