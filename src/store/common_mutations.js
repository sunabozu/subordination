import Vue from 'vue'
import * as types from './mutation-types'


export default {
	[types.LOAD_STATE](state, newState) {
		try {
			Object.assign(state.ui, newState.ui)
		} catch(e) {
			console.log(e)
			state.success = false
		}

		try {
			Object.assign(state.player, newState.player)
		} catch(e) {
			console.error(e)
			state.success = false
		}

		try {
			Object.assign(state.ost, newState.ost)
		} catch(e) {
			console.error(e)
			state.success = false
		}

		try {
			Object.assign(state.subfiles, newState.subfiles)
			// Vue.set(state, 'subfiles', newState.subfiles)
		} catch(e) {
			console.error(e)
			state.success = false
		}

		// state.success = true // if we loaded everything without errors
	},

	// [types.LOAD_SUBFILE](state, items) {
	// 	try {
	// 		// Object.assign(state.subfiles.items[state.subfiles.current].items, items)
	// 		// Vue.set(state.subfiles.items[state.subfiles.current].items, items)
	// 		for(let item of items) {
	// 			dispatch('ADD_SUBTITLE', item.current)
	// 		}
	// 	} catch(e) {
	// 		console.error(e)
	// 	}
	// }
}
