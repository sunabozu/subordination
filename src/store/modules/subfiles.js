'use strict'

import {remote} from 'electron'
// import path from 'path'
import {ms2string} from '../../utils/time'
import Vue from 'vue'
import * as types from '../mutation-types'


export default {
	state: {
		current: null,
		projects: {},
		export_path_default: remote.app.getPath('documents'),
		default_lang: 'eng',
	},

	mutations: {
		// project
		[types.ADD_PROJECT](subfiles, name, subfile) {
			Vue.set(subfiles.projects, name, subfile)
			// subfiles.projects.push(subfile)
		},

		[types.SET_CURRENT_PROJECT](subfiles, name) {
			subfiles.current = name
			// subfiles.current = index
			if(name && subfiles.projects[subfiles.current])
				subfiles.projects[subfiles.current].open_date = Date.now()
		},

		[types.DELETE_PROJECT](subfiles, name) {
			console.log(name, subfiles.projects[name])
			// delete subfiles.projects[name]
			Vue.delete(subfiles.projects, name)
		},

		[types.CHANGE_PROJECT_PROPERTIES](subfiles, props) {
			if(subfiles.projects[subfiles.current])
				Object.assign(subfiles.projects[subfiles.current], props)
		},

		[types.CHANGE_PROJECT_EXPORT_NAME](subfiles, export_name) {
			subfiles.projects[subfiles.current].export_name = export_name
		},

		[types.CHANGE_PROJECT_EXPORT_PATH](subfiles, export_path) {
			subfiles.projects[subfiles.current].export_path = export_path
		},

		// subfile
		[types.ADD_SUBTITLE](subfiles, subtitle) {
			subfiles.projects[subfiles.current].items.push(subtitle)
		},

		[types.SET_TRANSLATED_SUBTITLES_COUNT](subfiles, translated) {
			Vue.set(subfiles.projects[subfiles.current], 'translated', translated)
		},

		[types.ADD_SUBTITLES](subfiles, subtitles) {
			subfiles.projects[subfiles.current].items = subtitles
			// console.log(subfiles.projects[subfiles.current].items);
		},

		[types.MAKE_SUBTITLE_ACTIVE](subfiles, index) {
			if(subfiles.projects[subfiles.current].current_index == index || index < 0 || index > subfiles.projects[subfiles.current].items.length - 1)
				return

			subfiles.projects[subfiles.current].current_index = index
		},

		[types.UPDATE_SUBTITLE](subfiles, index, value) {
			// console.log(index, value);
			if(subfiles.projects[subfiles.current].items[index].text_trans === '' && value !== '')
				subfiles.projects[subfiles.current].translated++
			else {
				if(value === '' && subfiles.projects[subfiles.current].items[index].text_trans !== ''
						&& subfiles.projects[subfiles.current].translated > 0)
					subfiles.projects[subfiles.current].translated--
			}

			subfiles.projects[subfiles.current].items[index].text_trans = value
		},

		[types.UPDATE_SUBTITLE_FULL](subfiles, index, value) {
			Object.assign(subfiles.projects[subfiles.current].items[index], value)
		},

		[types.INSERT_SUBTITLE](subfiles, subtitle, index) {
			if(!subfiles.projects[subfiles.current])
				return

			subfiles.projects[subfiles.current].items.splice(index, 0, subtitle)
		},

		[types.DELETE_SUBTITLE](subfiles, index) {
			subfiles.projects[subfiles.current].items.splice(index, 1)
		},

		[types.RENUMBER_SUBTITLE](subfiles, index, number) {
			subfiles.projects[subfiles.current].items[index].number = number
		},

		[types.SET_SUBTITLE_TIME](subfiles, index, start, end) {
			subfiles.projects[subfiles.current].items[index].time_markers.start = start
			subfiles.projects[subfiles.current].items[index].time_markers.end = end

			// let result = ms2obj(subfiles.projects[subfiles.current].items[index].time_markers.start, true)
			// let time_start = `${result.hours}:${result.minutes}:${result.seconds}.${result.milliseconds}`
			// result = ms2obj(subfiles.projects[subfiles.current].items[index].time_markers.end, true)
			// let time_end = `${result.hours}:${result.minutes}:${result.seconds}.${result.milliseconds}`
			// subfiles.projects[subfiles.current].items[index].time = `${time_start} --> ${time_end}`
			subfiles.projects[subfiles.current].items[index].time = ms2string(
				subfiles.projects[subfiles.current].items[index].time_markers.start,
				subfiles.projects[subfiles.current].items[index].time_markers.end
			)
		},

		[types.SET_DEFAULT_EXPORT_PATH](subfiles, path) {
			if(typeof(path) === 'string')
				subfiles.export_path_default = path
		},

		[types.SET_DEFAULT_LANGUAGE](subfiles, lang) {
			subfiles.default_lang = lang
		},

		[types.CLEAR_SUBTITLES](subfiles) {
			if(subfiles.current && subfiles.projects[subfiles.current])
				subfiles.projects[subfiles.current].items = []
		},

		[types.SET_SUBFILE_FILTER](subfiles, filter) {
			subfiles.projects[subfiles.current].filter = filter
		},

		[types.SET_VIDEO_FILE](subfiles, file_path) {
			Vue.set(subfiles.projects[subfiles.current], 'video_path', file_path)
		},

		[types.CLEAR_VIDEO_FILE](subfiles) {
			console.log('clear')
			Vue.set(subfiles.projects[subfiles.current], 'video_path', null)
			Vue.set(subfiles.projects[subfiles.current], 'video_position', 0.0)
		},

		[types.SET_CURRENT_VIDEO_POSITION](subfiles, position) {
			Vue.set(subfiles.projects[subfiles.current], 'video_position', position)
		}
	}
}
