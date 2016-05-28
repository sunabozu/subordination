'use strict'

function pad(number) {
  return (number < 10 ? '0' : '') + number
}

export function ms2obj(time, ms) {
	const result = {}

	if(ms) // calculate milliseconds if needed
		result.milliseconds = pad(parseInt(time % 1000))

	let x = time / 1000

	result.seconds = pad(parseInt(x % 60))
	x /= 60
	result.minutes = pad(parseInt(x % 60))
	x /= 60
	result.hours = pad(parseInt(x % 24))

	return result
}

function add_zerrows(data, length) {
	data = data.toString()
	const diff = length - data.length
	if(diff > 0) {
		for(let i = 0; i < diff; i++) {
			data += '0'
		}
	}

	return data
}

export function ms2string(start, end) {
	let result = ms2obj(start, true)
	let time_start = `${add_zerrows(result.hours, 2)}:${add_zerrows(result.minutes, 2)}:${add_zerrows(result.seconds, 2)},${add_zerrows(result.milliseconds, 3)}`
	result = ms2obj(end, true)
	let time_end = `${add_zerrows(result.hours, 2)}:${add_zerrows(result.minutes, 2)}:${add_zerrows(result.seconds, 2)},${add_zerrows(result.milliseconds, 3)}`

	return `${time_start} --> ${time_end}`
}
