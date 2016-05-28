'use strict'

import actions from '../actions'


export default {
	loadState({actions, state, dispatch}, newState) {
		dispatch('LOAD_STATE', newState)

		// if(state.subfiles.current && state.subfiles.projects[state.subfiles.current] && state.subfiles.projects[state.subfiles.current].video_path) {
		// 	actions.setVideoFileForPlayer(
		// 		state.subfiles.projects[state.subfiles.current].video_path,
		// 		state.subfiles.projects[state.subfiles.current].video_position
		// 	)
		// }

		console.log(state.subfiles.current)
	},

	loadSubfile({dispatch, state}, items) {
		console.log('loading subfile')
		// dispatch('ADD_SUBTITLES', items)
		let translated = 0


		dispatch('ADD_SUBTITLES', items)

		for(let item of items) {
			// dispatch('ADD_SUBTITLE', item)

			if(item.text_trans !== '')
				translated++
		}

		dispatch('SET_TRANSLATED_SUBTITLES_COUNT', translated)
		// dispatch('LOAD_SUBFILE', newSubfile)

		if(state.subfiles.projects[state.subfiles.current].video_path) {
			actions.player.setVideoFileForPlayer(
				{dispatch, state},
				state.subfiles.projects[state.subfiles.current].video_path,
				state.subfiles.projects[state.subfiles.current].video_position
			)
		} else {
			actions.player.unloadVideoFile({dispatch})
		}
	},

	setVideoFile({dispatch, state}, file_path) {
		console.log('subfile', state.subfiles.projects[state.subfiles.current])
		actions.subfiles.setVideoFileForSubfile({dispatch}, file_path)
		actions.player.setVideoFileForPlayer(
			{dispatch, state},
			file_path,
			state.subfiles.projects[state.subfiles.current].video_position
		)
	},

	closeProject({dispatch, state}) {
		if(!state.subfiles.current)
			return

		dispatch('CLEAR_SUBTITLES')
		dispatch('SET_CURRENT_PROJECT', null)

		actions.player.unloadVideoFile({dispatch})
	}
}
