<script>
'use strict'

import Vue from 'vue'

export default {
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
	<progress value="{{value}}" max="{{max}}"></progress>
</template>
