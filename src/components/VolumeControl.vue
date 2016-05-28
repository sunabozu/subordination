<script>
'use strict'

import actions from '../store/actions'
import Vue from 'vue'
import iButton from './iButton.vue'
import Range from './range.vue'


export default {
	components: {
		iButton,
		Range
	},

	data() {
		return {
			rangeShown: false,
		}
	},

	props: {
		disabled: {},
	},

	vuex: {
		getters: {
			volume(state) {
				return state.player.volume
			},

			muted(state) {
				return state.player.muted
			}
		},

		actions: {
			mutePlayer: actions.player.mutePlayer,
			setVolume: actions.player.setVolume,
		}
	},

	computed: {
		icon() {
			return this.muted ? 'mute' : 'sound'
		},

		title() {
			return this.muted ? 'Unmute' : 'Mute'
		}
	},

	methods: {
		toggleMute() {
			this.mutePlayer(!this.muted)
		},

		showRange() {
			if(this.disabled)
				return

			this.rangeShown = true

			Vue.nextTick(() => {
				const bound = this.$els.btn.getBoundingClientRect()
				// this.$els.popup.style.top = 0 - (this.$els.popup.clientHeight + this.$els.btn.clientHeight) / 2 - this.$els.btn.clientHeight - 5 + 'px'
				this.$els.popup.style.top = bound.top - this.$els.popup.clientHeight - 2 + 'px' //0 - this.$els.popup.clientHeight - 5 - this.$els.btn.clientHeight + 'px'
				this.$els.popup.style.left = bound.left - this.$els.popup.clientWidth / 2 + this.$els.btn.clientWidth / 2 + 'px' //5 - this.$els.btn.clientWidth + 'px'
				console.log(this.$els.popup.style.top)
			})
		},

		hideRange() {
			this.rangeShown = false
		},

		volumeChanged(volume) {
			console.log(volume)
			this.setVolume(volume)
		},

		onScroll(e) {
			if(this.disabled)
				return
			
			console.log(e.deltaY)
			const value = this.volume - parseInt(e.deltaY / 3)

			if(value >= 0 && value <= 200)
				this.setVolume(value)
		}
	},

	ready() {

	},
}
</script>

<template>
	<span @mouseleave="hideRange" @mousewheel="onScroll">
		<div v-if="rangeShown" v-el:popup class="volume" transition="volume">
			<range :min="0" :max="200" :step="2" :value="volume" @after-change="volumeChanged" width="80px"></range>
		</div>
		<i-button v-el:btn :icon="icon" :title="title" :disabled="disabled" @click="toggleMute" @mouseenter="showRange">
		</i-button>
	</span>
</template>
