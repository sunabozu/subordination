<script>
'use strict'

export default {
	components: {

	},

	data() {
		return {
			isActive: false
		}
	},

	props: {
		header: {}
	},

	computed: {

	},

	events: {
		'make-active': function(header) {
			if(header === this.header)
				this.isActive = true
			else
				this.isActive = false

			console.log('active!', this.isActive)
		}
	},

	methods: {

	},

	ready() {
		this.$dispatch('new-tab', this.header)
	},
}
</script>

<template>
	<div class="tab-content" v-show="isActive">
		<slot></slot>
	</div>
</template>
