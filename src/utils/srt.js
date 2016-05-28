'use strict'

const p_number = /^(\d+)[\r\n]*$/m
const p_number_new = /^(\d+)$/
const p_time = /^(\d{1,2}):(\d{1,2}):(\d{1,2}),(\d{1,3}) --> (\d{1,2}):(\d{1,2}):(\d{1,2}),(\d{1,3})\s*/
const p_time_item = /(\d{1,2}):(\d{1,2}):(\d{1,2}),(\d{1,3})/


function __time_to_milliseconds(hours, minutes, seconds, milliseconds) {
	hours = parseInt(hours)
	minutes = parseInt(minutes)
	seconds = parseInt(seconds)
	milliseconds = parseInt(milliseconds)

	return milliseconds + (seconds + minutes * 60 + hours * 3600) * 1000
}

function parse_time(match) {
	const start = __time_to_milliseconds(
		match[1],
		match[2],
		match[3],
		match[4]
	)
	const end = __time_to_milliseconds(
		match[5],
		match[6],
		match[7],
		match[8]
	)
	return {start, end}
}

export function str_to_dict(content, callback) {
	const lines = content.replace(/\r/g, '').split('\n')
	// yield lines.length //return the number of lines

	if(lines.length > 0) {
		const contains_digit = /.*(\d+).*/.exec(lines[0])

		if(contains_digit) {
			lines[0] = contains_digit[1]
		}
	}

	let current_line = 0
	let current = null //current item we need to yield return
	let new_title = false

	for(let line of lines) {
		current_line++

		if(line === '') {
			new_title = false
			continue
		}

		if(p_number.exec(line)) {
			if(current) {
				// yield {current, current_line} //return
				// yield current
				callback(current)
			}

			current = {
				number: parseInt(line),
				time: '',
				time_markers: '',
				text_orig: '',
				text_trans: '',
			}
			new_title = true
			continue
		}

		const match = p_time.exec(line)
		if(match) {
			current.time = line
			current.time_markers = parse_time(match)
			continue
		}

		if(new_title) {
			if(current.text_orig != '')
				current.text_orig += '\n'
			current.text_orig += line
		}
	}

	// yield {current, current_line} //return the last item
	// yield current
	callback(current, 'done')
}

export function dict_to_srt(subtitles, empty_titles_policy) {
	let result = ''

	for(let subtitle of subtitles) {
		if(empty_titles_policy === 1 && subtitle.text_trans == '') // ignore
			continue

		result += subtitle.number + '\n'
		result += subtitle.time + '\n'

		if(subtitle.text_trans == '') { // replace with original
			result += subtitle.text_orig
		} else {
			result += subtitle.text_trans
		}

		result += '\n\n'
	}

	return result
}

// function parser (stream, callback) {
// 	let current_line = 0
// 	let current = null //current item we need to yield return
// 	let new_title = false
//
// 	stream.on('line', (line) => {
// 		current_line++
//
// 		if(current_line == 1) {
// 			const contains_digit = /.*(\d+).*/.exec(line)
//
// 			if(contains_digit) {
// 				line = contains_digit[1]
// 			}
// 		}
//
// 	  // console.log('==>', line)
//
// 		if(line === '') {
// 			new_title = false
// 			return
// 		}
//
// 		if(p_number_new.exec(line)) {
// 			if(current) {
// 				// stream.pause()
// 				callback({current, current_line}) //return previous item
// 				// stream.resume()
// 			}
//
// 			current = {
// 				number: parseInt(line),
// 				time: '',
// 				time_markers: '',
// 				text_orig: ''
// 			}
// 			new_title = true
// 			return
// 		}
//
// 		const match = p_time.exec(line)
// 		if(match) {
// 			current.time = line
// 			current.time_markers = parse_time(match)
// 			return
// 		}
//
// 		if(new_title) {
// 			if(current.text_orig != '')
// 				current.text_orig += '\n'
// 			current.text_orig += line
// 		}
// 	});
//
// 	stream.on('close', () => {
// 	  console.log('EOF');
// 		return callback({current, current_line, done: true})
// 	})
// }
