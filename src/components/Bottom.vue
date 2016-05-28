<script>
'use strict'

import Vue from 'vue'

import Buffering from './Buffering.vue'


export default {
	components: {
		'buffering': Buffering,
	},

	data: () => {
		return {
		}
	},

	props: {
		state: {
			required: true
		}
	},

	methods: {
	},

	ready: function() {
	}
}
</script>

<template>
	<footer class="toolbar toolbar-footer">
		<!-- {{currentLine}} -->
		<!-- <v-progress :value="currentLine" :max="4000"></v-progress> -->
		<buffering :value="state.player.buffering" :max="100"></buffering>
	</footer>
</template>
