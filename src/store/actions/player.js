'use strict'

import actions from '../actions'


let wcjs = null

// keep these two outside of the state
let instance = null
let canvas = null

export default {
	initPlayer({dispatch, state}, canvas) {
		if(!canvas) {
			console.log('There is no canvas, cannot initialize')
			return 1
		}

		if(!wcjs) { // trying to load
			wcjs = require('wcjs-renderer')
		}

		const webchimera = require('./import_webchimera.js')()
		console.log(webchimera)

		if(!webchimera) {
			dispatch('PLUGINS_EXIST', false)
			console.log('There is no webchimera module in place')
			return 2
		}

		dispatch('PLUGINS_EXIST', true)

		instance = wcjs.init(canvas, null, null, webchimera) //, ['--no-playlist-autostart'])

		instance.onOpening = () => {
			dispatch('SET_PLAYER_STATE', 'opening')
			console.log('on opening')
		}

		instance.onBuffering = (percents) => {
			dispatch('SET_PLAYER_STATE', 'buffering')
			dispatch('SET_BUFFERING', percents)
		}
	},

	mutePlayer({dispatch, state}, mute) {
		console.log(`mute ${state.player.muted} ${mute}`)

		dispatch('MUTE_PLAYER', mute)

		if(instance.mute != mute)
			instance.toggleMute()
	},

	setVolume({dispatch, state}, volume) {
		dispatch('SET_VOLUME', volume)
		instance.volume = volume
	},

	setVideoFileForPlayer({dispatch, state}, file_path, position) {
		console.log('state:', state)
		if(!instance)
			return 1

		const prefix = process.platform == 'win32' ? 'file:///' : 'file://'
		instance.play(`${prefix}${file_path}`)

		instance.volume = state.player.volume
		console.log('volume: ', instance.volume)
		actions.player.mutePlayer({dispatch, state}, state.player.muted)
		console.log(state.player.muted, instance.mute)

		// here is the point where video is loaded and ready
		// get the first frame
		instance.onPlaying = () => { // first playing
			instance.pause()

			// replace it with a regular onPlaying callback
			instance.onPlaying = () => {
				dispatch('SET_PLAYER_STATE', 'playing')
				console.log('playing')
			}
		}

		instance.onLengthChanged = (length) => {
			console.log('length changed', length)
			dispatch('SET_VIDEO_METADATA',
				0,
				0,
				length)
		}

		instance.onPaused = () => { // first paused
			dispatch('SET_PLAYER_STATE', 'paused')

			//restore saved position
			console.log('position', position)
			if(position) {
				actions.player.setVideoPosition({dispatch, state}, position)
			}

			instance.onTimeChanged = (time) => {
				dispatch('SET_CURRENT_TIME', time)
			}

			instance.onPositionChanged = (position) => {
				dispatch('SET_CURRENT_VIDEO_POSITION', position)
				// console.log('position changed', position)

				if(state.player.stopAfterPlay > 0 && state.player.current_time >= state.player.stopAfterPlay) { // stop right there if needed
					instance.pause()
					dispatch('STOP_AFTER_PLAY', 0)
					console.log('stop right there!')
				}
			}

			// replace it with a regular onPaused callback
			instance.onPaused = () => {
				dispatch('SET_PLAYER_STATE', 'paused')
			}

			instance.onStopped = () => {

			}

			instance.onEndReached = () => {
				dispatch('SET_PLAYER_STATE', 'ended')
				instance.pause()
			}
		}

		// get frame data - width and height
		let onFrameReady = instance.onFrameReady
		instance.onFrameReady = (frame) => {
			console.log('metadata', frame.width, frame.height, instance.length)
			dispatch('SET_VIDEO_METADATA',
				frame.width,
				frame.height,
				0.0)

			instance.onFrameReady = onFrameReady
		}

		if(state.subfiles.current)
			instance.subtitles.load(state.subfiles.projects[state.subfiles.current].path)
	},

	unloadVideoFile({dispatch}) {
		if(!instance)
			return 1

		instance.stop()

		dispatch('RESET_VIDEO')

		// reset imdbid
		dispatch('CHANGE_PROJECT_PROPERTIES', {imdbid: null})
	},

	setVideoTime({dispatch, state}, time) { // jump to some particular time position
		if(!instance)
			return 1

		actions.player.setVideoPosition({dispatch, state}, time / state.player.metadata.length)
		console.log(`time: ${time}/${state.player.metadata.length}`)
	},

	setVideoPosition({dispatch, state}, position) {
		if(!instance)
			return 1

		if(0 >= position >= 1)
			return

		if(state.player.state.ended)
			instance.play()

		instance.position = position
		dispatch('SET_CURRENT_VIDEO_POSITION', position)
		dispatch('SET_CURRENT_TIME', instance.time)
		console.log('changed position', position)
	},

	// setSubfile: 'SET_SUBFILE',
	setSubfile({state}) {
		if(state.subfiles.current)
			instance.subtitles.load(state.subfiles.projects[state.subfiles.current].path)
	},

	toggleVideo({state}) {
		if(!instance || !wcjs)
			return 1

		if(state.player.state.ended)
			instance.play()
		else
			instance.togglePause()
	},

	play() {
		instance.play()
	},

	pause() {
		instance.pause()
	}
}
