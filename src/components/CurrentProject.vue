<script>
'use strict'

import {remote} from 'electron'
import actions from '../store/actions'
import ProjectItem from './ProjectItem.vue'
import iButton from './iButton.vue'
// import Popover from './Popover.vue'
// import Spinner from './Spinner.vue'


export default {
	components: {
		ProjectItem,
		iButton,
		// Popover,
		// Spinner,
	},

	data: () => {
		return {
			// popoverShown: false,


		}
	},

	props: {
		item: {},

		// containerWidth: {}
	},

	vuex: {

	},

	computed: {
		// popoverComponent() {
		// 	if(this.popoverShown)
		// 		return 'popover'
		// 	else
		// 		return null
		// },


	},

	events: {
	},

	methods: {
		showPopover(e) {
			this.$dispatch('on-show-project-properties', this.$els.propertyButton)
		},

		hidePopover() {
			this.popoverShown = false
		},

	},

	ready() {
		this.$el.focus()
	},
}
</script>

<template>
	<div class="current-project">
		<div class="project-expanded">
			<div class="project-desc">
				<span>Total</span>
				<span v-if="item.value.items.length">{{item.value.items.length}}</span>
				<span v-else>opening...</span>
			</div>
			<div class="project-desc">
				<span>Translated</span>
				<span>{{item.value.translated}}</span>
			</div>
			<div class="project-desc">
				<span>Properties</span>
				<i-button class="btn-dark btn-micro" icon="cog" @click="showPopover" v-el:property-button title="Change properties of the current project">
				</i-button>
			</div>
		</div>
	</div>
</template>
