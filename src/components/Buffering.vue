<script>
'use strict'

import Vue from 'vue'
import VProgress from './VProgress.vue'

export default {
	components: {
		'v-progress': VProgress,
	},

	data: () => {
		return {
		}
	},

	props: {
		value: {
			type: Number,
			required: true
		},
		max: {
			type: Number,
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
	<div class="buffering" v-show="value !== 100">
		Buffering <v-progress :value="value" :max="max"></progress>
	</div>
</template>
