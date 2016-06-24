'use strict'

import path from 'path'
import actions from '../actions'
import {ms2string} from '../../utils/time'
import parser from '../../utils/SubParserWorker'


export default {
	// return promise
	openSubfile({dispatch, state}, file_path) {
		return new Promise((resolve, reject) => {
			let already_exists = false
			for(let key in state.subfiles.projects) {
				console.log(key)
				if(state.subfiles.projects[key].path == file_path) {
					already_exists = true
					break
				}
			}

			if(already_exists) {
				console.log('project already exists')
				reject(`The project already exists`)
				return
			}

			if(state.subfiles.current)
				dispatch('CLEAR_SUBTITLES')

			console.log('adding new project')
			dispatch('ADD_PROJECT', path.basename(file_path), {
				translated: 0,
				export_name: path.basename(file_path),
				export_path: null,
				export_mode: 0, // 0: replace with original, 1: ignore
				path: file_path,
				video_path: null,
				lang: null,
				imdbid: null,
				video_position: 0.0,
				scroll: 0,
				current_index: 0,
				items: [],
				filter: 'all',
				open_date: Date.now(),
			})

			console.log('set current project')

			dispatch('SET_CURRENT_PROJECT', path.basename(file_path))

			console.log('execute parsing')

			actions.subfiles.parseSubfile({dispatch}, file_path)
				.catch(err => { // rollback of an error
					console.error(err)
					actions.common.closeProject({dispatch, state})
					actions.subfiles.deleteProject({dispatch}, path.basename(file_path))

					reject(err)
				})
		})
	},

	deleteProject({dispatch}, name) {
		setTimeout(() => { // need to be async, otherwise causes an exception
			dispatch('DELETE_PROJECT', name)
		}, 1)
	},

	setCurrentProject({dispatch}, name) {
		dispatch('CLEAR_SUBTITLES')
		dispatch('SET_CURRENT_PROJECT', name)
	},

	changeProjectProperties({dispatch}, props) {
		dispatch('CHANGE_PROJECT_PROPERTIES', props)
	},

	changeProjectExportName({dispatch}, export_name) {
		dispatch('CHANGE_PROJECT_EXPORT_NAME', export_name)
	},

	changeProjectExportPath({dispatch}, export_path) {
		dispatch('CHANGE_PROJECT_EXPORT_PATH', export_path)
	},

	// return promise
	parseSubfile({dispatch, state}, file_path) {
		console.log('parsing')

		return new Promise((resolve, reject) => {
			parser(file_path, (error, result) => {
				console.log(result);

				if(error) {
					console.log(error)
					return reject(error)
				}

				// for(let item of result) {
				// 	dispatch('ADD_SUBTITLE', item)
				// }
				dispatch('ADD_SUBTITLES', result)

			})
		})
	},

	makeItemActive({dispatch, state}, index) {
		dispatch('MAKE_SUBTITLE_ACTIVE', index)
	},

	moveItem({dispatch, state}, direction) {
		// const currentIndex = state.subfile.items.indexOf(item)

		if(direction === 'next' && state.subfiles.projects[state.subfiles.current].current_index < state.subfiles.projects[state.subfiles.current].items.length - 1) {
			dispatch('MAKE_SUBTITLE_ACTIVE', state.subfiles.projects[state.subfiles.current].current_index + 1)
			return 1 // success
		}
		if(direction === 'prev' && state.subfiles.projects[state.subfiles.current].current_index > 0) {
			dispatch('MAKE_SUBTITLE_ACTIVE', state.subfiles.projects[state.subfiles.current].current_index - 1)
			return 1 // success
		}
	},

	updateSubtitle({dispatch, state}, index, value) {
		dispatch('UPDATE_SUBTITLE', index, value)
	},

	updateSubtitleFull({dispatch}, index, value) {
		dispatch('UPDATE_SUBTITLE_FULL', index, value)
	},

	deleteCurrentSubtitle({dispatch, state}) {
		if(!state.subfiles.projects[state.subfiles.current] || state.subfiles.projects[state.subfiles.current].current_index < 0)
			return

		// TODO make it choose current index when it's possible
		// const index = state.subfiles.projects[state.subfiles.current].current_index

		// delete
		dispatch('DELETE_SUBTITLE', state.subfiles.projects[state.subfiles.current].current_index)

		// try to make next title active
		// if fails, try to move backward
		if(state.subfiles.projects[state.subfiles.current].current_index < state.subfiles.projects[state.subfiles.current].items.length)
			dispatch('MAKE_SUBTITLE_ACTIVE', state.subfiles.projects[state.subfiles.current].current_index)
		else
			actions.subfiles.moveItem('prev')
	},

	reindexSubfile({dispatch, state}, start_from) {
		if(!state.subfiles.projects[state.subfiles.current])
			return

		const array = (JSON.parse(JSON.stringify(state.subfiles.projects[state.subfiles.current].items)))

		if(!start_from || start_from >= array.length)
			start_from = 0

		for(let i = start_from; i < array.length; i++) {
			if(array[i] && array[i].number != i + 1)
				// dispatch('RENUMBER_SUBTITLE', i - 1, i)
				console.log(array[i].number)
				array[i].number = i + 1
		}

		dispatch('ADD_SUBTITLES', array)
	},

	// policy: 0 - remove, 1 - shift to the beginning
	shiftSubtitles({dispatch, state}, shift, policy) {
		if(!state.subfiles.projects[state.subfiles.current]) {
			return
		}

		const array = (JSON.parse(JSON.stringify(state.subfiles.projects[state.subfiles.current].items)))
		let start = 0
		let end = 0

		for(let i = 0; i < array.length; i++) {
			start = array[i].time_markers.start + shift
			end = array[i].time_markers.end + shift

			if(start < 0) {
				if(policy === 0) {
					array.splice(i, 1)
					i--
					continue
				} else {
					end -= start
					start = 0
				}
			}

			array[i].time_markers.start = start
			array[i].time_markers.end = end

			array[i].time = ms2string(
				array[i].time_markers.start,
				array[i].time_markers.end
			)
		}

		dispatch('ADD_SUBTITLES', array)
	},

	setDefaultExportPath({dispatch, state}, path) {
		dispatch('SET_DEFAULT_EXPORT_PATH', path)
	},

	setDefaultLanguage({dispatch, state}, lang) {
		dispatch('SET_DEFAULT_LANGUAGE', lang)
	},

	copyOriginalSubitem({dispatch, state}, index) {
		dispatch('UPDATE_SUBTITLE', index, state.subfiles.projects[state.subfiles.current].items[index].text_orig)
	},

	setSubfileFilter({dispatch, state}, filter) {
		dispatch('SET_SUBFILE_FILTER', filter)
	},

	setVideoFileForSubfile({dispatch, state}, file_path) {
		dispatch('SET_VIDEO_FILE', file_path)
	},

	clearVideoFile({dispatch}) {
		dispatch('CLEAR_VIDEO_FILE')
	},
}
