<script>
'use strict'

export default {
	components: {

	},

	props: {
		size: {
			default: 'small'
		}
	},

	computed: {
		computedSize() {
			switch(this.size) {
				case 'small':
				default:
					return 16
				case 'normal':
					return 26
				case 'big':
					return 34
			}
		}
	},

	methods: {

	},

	ready() {

	},
}
</script>

<template>
	<svg :width="computedSize + 'px'" :height="computedSize + 'px'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring-alt"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><circle class="spinner-circle" cx="50" cy="50" r="34" fill="none" stroke-width="12" stroke-linecap="round"><animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="502"></animate><animate attributeName="stroke-dasharray" dur="2s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4"></animate></circle></svg>
</template>
