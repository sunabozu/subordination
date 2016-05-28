'use strict'

import {remote} from 'electron'


const setEdited = function(edited) {
	try {
		const win = remote.getCurrentWindow()

		if(win)
			win.setDocumentEdited(edited)
	} catch(e) {

	}
}

export default {
	onInit(state, store) {

	},

	onMutation(mutation, state, store) {
		switch(mutation.type) {
			case 'CHANGE_PROJECT_EXPORT_NAME':
			case 'CHANGE_PROJECT_EXPORT_PATH':
			case 'ADD_SUBTITLE':
			case 'UPDATE_SUBTITLE':
			case 'UPDATE_SUBTITLE_FULL':
			case 'INSERT_SUBTITLE':
			case 'DELETE_SUBTITLE':
			case 'RENUMBER_SUBTITLE':
			case 'SET_SUBTITLE_TIME':
				const win = remote.getCurrentWindow()

				if(!win.isDocumentEdited()) {
					setEdited(true)
					console.log('edited', mutation.type)
				}
				break

			case 'SET_CURRENT_PROJECT':
			case 'CLEAR_SUBTITLES':
				setEdited(false)
				console.log('not edited', mutation.type)
				break
		}
	}
}
