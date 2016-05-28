<script>
'use strict'

import Vue from 'vue'
import actions from '../store/actions'

import VideoControls from './VideoControls.vue'
import PluginLoader from './PluginLoader.vue'


export default {
	components: {
		'video-controls': VideoControls,
		PluginLoader,
	},

	data() {
		return {
			pluginsNotReady: false
		}
	},

	props: {
	},

	vuex: {
		getters: {
			service(state) {
				return state.player
			},

			subfile(state) {
				return state.subfiles.projects[state.subfiles.current]
			},
		},

		actions: {
			setVideoFileForPlayer: actions.player.setVideoFileForPlayer,
		}
	},

	computed: {
	},

	methods: {
		togglePlayback: function() {
			// store.actions.toggleVideo()
			// console.log(this.service.player);
		},

		onResize: function() {
			if(this.service.metadata.height < 1)
				return

			const aspectRatio = this.service.metadata.width / this.service.metadata.height

			const wc = this.$el.clientWidth
			const hc = this.$el.clientHeight - 24 // [not] considering the height of control panel
			const aspectRatioContainer = wc / hc

			if(aspectRatio < aspectRatioContainer) { // if container is wider
				this.$els.box.style.height = hc + 'px'

				const wv = hc * aspectRatio
				this.$els.box.style.width = wv + 'px'

				this.$els.box.style.top = 0 + 'px'
				this.$els.box.style.left = (wc - wv) / 2 + 'px'
			} else { //if video is wider
				this.$els.box.style.width  = wc + 'px'

				const hv = wc / aspectRatio
				this.$els.box.style.height = hv + 'px'

				this.$els.box.style.left = 0 + 'px'
				this.$els.box.style.top = (hc - hv) / 2 + 'px'
			}

			return
		},

		onPluginsReady() {
			// this.pluginsNotReady = false
			this.$dispatch('canvas-ready', this.$els.canvas)

			// load a video file if any
			if(this.subfile && this.subfile.video_path) {
				this.setVideoFileForPlayer(this.subfile.video_path, this.subfile.video_position)
			}
		}
	},

	events: {
		'splitter-resize': function() {
			this.onResize()
		},

		'plugins-not-ready': function(not_ready) {
			this.pluginsNotReady = not_ready
		}
	},

	ready: function() {
		// store.actions.initPlayer(this.$els.canvas)
		this.$dispatch('canvas-ready', this.$els.canvas)

		window.addEventListener('resize', () => {
			this.onResize()
		})

		this.$watch('service.metadata.height', (newValue, oldValue) => {
			if(newValue != oldValue)
				this.onResize()
		})
	}
}
</script>

<template>
	<div class="video-container">
		<div class="video-box" v-el:box>
			<canvas v-show="!service.state.stopped" v-el:canvas v-on:click="togglePlayback" width="0" height="0"></canvas>
		</div>
		<plugin-loader v-if="pluginsNotReady" @plugins-ready="onPluginsReady"></plugin-loader>
		<video-controls :player="service" :subfile="subfile"></video-controls>
	</div>
</template>
