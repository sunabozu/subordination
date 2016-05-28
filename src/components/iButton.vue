<script>
'use strict'

import NonMovable from '../mixins/NonMovable'


export default {
	mixins: [
		NonMovable,
	],

	props: {
		icon: {
			type: String,
			default: ''
		},
		disabled: {}
	},

	computed: {
		iconClass() {
			return `icon-${this.icon}`
		}
	},

	methods: {

	},

	ready() {

	},
}
</script>

<template>
	<button class="btn btn-default" :disabled="disabled">
		<span class="icon" :class="iconClass" :disabled="disabled"></span>
		<slot></slot>
	</button>
</template>
