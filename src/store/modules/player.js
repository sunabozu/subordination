'use strict'


// import debounce from 'lodash/function/debounce'
import Vue from 'vue'
import * as types from '../mutation-types'
import debounce from '../../utils/debounce'


export default {
	state: {
		plugins_exist: false,

		volume: 50,
		muted: false,

		// videofile_path: null,
		subfile_path: null,
		current_time: 0,
		// current_position: 0.0,
		buffering: 100,

		// just a temporary marker
		stopAfterPlay: 0,

		state: {
			stopped: true,
			opening: false,
			buffering: false,
			playing: false,
			paused: false,
			ended: false,
		},

		metadata: {
			width: 0,
			height: 0,
			length: 0,
		}
	},

	// mutations
	mutations: {
		[types.PLUGINS_EXIST](player, exist) {
			console.log('pugins exist', player.plugins_exist)
			if(typeof exist == 'boolean')
				player.plugins_exist = exist

			console.log('pugins exist', player.plugins_exist)
		},

		[types.MUTE_PLAYER](player, mute) {
			player.muted = mute
		},

		[types.SET_VOLUME](player, volume) {
			player.volume = volume
		},

		[types.SET_VIDEO_METADATA](player, width, height, length) {
			if(width > 0 && height > 0) {
				player.metadata.width = width
				player.metadata.height = height
			}

			if(length > 0)
				player.metadata.length = length
		},

		// [types.SET_SUBFILE]({player}, file_path) {
		// 	if(file_path)
		// 		player.subfile_path = file_path
		//
		// 	if(instance && player.subfile_path) {
		// 		instance.subtitles.load(player.subfile_path)
		// 	}
		// },

		[types.SET_CURRENT_TIME](player, time) {
			player.current_time = time // milliseconds
		},

		// [types.SET_CURRENT_POSITION]({player}, position) {
		// 	player.current_position = position // %
		// },

		[types.SET_BUFFERING](player, percents) {
			player.buffering = percents
		},

		[types.SET_PLAYER_STATE](player, newState) {
			switch (newState) {
				case 'opening':
					player.state.opening = true
					player.state.stopped = false
					player.state.ended = false
					break
				case 'buffering':
					player.state.buffering = true
					player.state.opening = false
					player.state.ended = false
					break
				case 'playing':
					player.state.playing = true
					player.state.paused = false
					player.state.ended = false
					break
				case 'paused':
					player.state.paused = true
					player.state.playing = false
					player.state.ended = false
					break
				case 'ended':
					player.state.ended = true
					player.state.playing = false
					player.state.paused = true
			}
		},

		[types.RESET_VIDEO](player) {
			player.state.stopped = true
			player.state.playing = false
			player.state.paused = false
			player.state.buffering = false
			player.state.ended = false

			Object.assign(player.metadata, {width: 0, height: 0, length: 0})

			// player.videofile_path = null
			player.current_time = 0
			// player.current_position = 0
			player.buffering = 100
		},

		[types.STOP_AFTER_PLAY](player, time) {
			player.stopAfterPlay = time
		}

	}
}
