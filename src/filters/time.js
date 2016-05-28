'use strict'

import Vue from 'vue'
import {ms2obj} from '../utils/time'


Vue.filter('time', time => {
	let {hours, minutes, seconds} = ms2obj(time)

	return `${hours}:${minutes}:${seconds}`
})
