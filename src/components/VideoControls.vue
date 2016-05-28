<script>
'use strict'

import Vue from 'vue'
import actions from '../store/actions'

import iButton from './iButton.vue'
import VolumeControl from './VolumeControl.vue'
import range from './range.vue'


export default {
	components: {
		'i-button': iButton,
		'range': range,
		VolumeControl,
	},

	data: () => {
		return {
		}
	},

	props: {
		player: {
			type: Object,
			required: true
		},

		subfile: {
			coerce(value) {
				if(value && value.video_position != undefined)
					return value
				else
					return {video_position: 0.0}
			}
		}
	},

	vuex: {
		actions: {
			toggleVideo: actions.player.toggleVideo,
			unloadVideoFile: actions.player.unloadVideoFile,
			clearVideoFile: actions.subfiles.clearVideoFile,
			setVideoPosition: actions.player.setVideoPosition,
		}
	},

	computed: {
		play_icon() {
			if(this.player.state.playing)
				return 'pause'
			else
				return 'play'
		},

		play_title() {
			if(this.player.state.playing)
				return 'Pause'
			else
				return 'Play'
		},

		play_enabled() {
			if(this.player.state.stopped || this.player.state.opening)
				return false
			else
				return true
		}
	},

	methods: {
		togglePlayback: function() {
			this.toggleVideo()
			// console.log(this.service.player);
		},

		stop() {
			this.unloadVideoFile()
			this.clearVideoFile()
		},

		onChangeVideoPosition(position) {
			this.setVideoPosition(position)
		}
	},

	events: {
	},

	ready: function() {
	}
}
</script>

<template>
	<div class="video-controls">
		<div class="btn-group">
			<i-button :icon="play_icon" :title="play_title" :disabled="!play_enabled" @click="togglePlayback"></i-button>
			<i-button :icon="'stop'" :title="'Stop and unload video'" :disabled="!play_enabled" @click="stop"></i-button>
			<volume-control :disabled="!play_enabled"></volume-control>
		</div>
		<range :value="subfile.video_position" :disabled="!play_enabled" @after-change="onChangeVideoPosition"></range>
		<label :class="{'disabled': !play_enabled}">{{player.current_time | time}}</label>
	</div>
</template>
