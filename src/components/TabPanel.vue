<script>
'use strict'

import Tabs from './Tabs.vue'


export default {
	components: {
		Tabs,
	},

	data: () => {
		return {
			tabs: [],
			model: 0
		}
	},

	props: {

	},

	computed: {

	},

	events: {
		'new-tab': function(header) {
			this.tabs.push({
				key: header,
				text: header
			})

			if(this.tabs.length === 1) { // if it's a first tab item
				this.$broadcast('make-active', header)
				this.model = header
			}
		}
	},

	methods: {
		tabSelected(header) {
			this.model = header
			this.$broadcast('make-active', header)
		}
	},

	ready() {

	},
}
</script>

<template>
	<div class="form-panel tab-panel">
		<tabs
			:choices="tabs"
			:model="model"
			@on-change="tabSelected"
			>
		</tabs>
		<slot></slot>
	</div>
</template>
