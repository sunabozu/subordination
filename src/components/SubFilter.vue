<script>
'use strict'

import actions from '../store/actions'
import Tabs from './Tabs.vue'


export default {
	components: {
		Tabs,
	},

	data() {
		return {
			filterChoices: [
				{
					text: 'Empty',
					key: 'empty'
				},
				{
					text: 'All',
					key: 'all'
				},
				{
					text: 'Ready',
					key: 'ready'
				}
			],
		}
	},

	vuex: {
		getters: {
			subfiles(state) {
				return state.subfiles
			}
		},

		actions: {
			setSubfileFilter: actions.subfiles.setSubfileFilter,
		}
	},

	computed: {
		currentProject() {
			return this.subfiles.projects[this.subfiles.current]
		},

		subtitleFilter() {
			if(this.currentProject)
				return this.currentProject.filter
			else
				return 'all'
		},
	},
}
</script>

<template>
	<tabs
		:choices="filterChoices"
		:model="subtitleFilter"
		@on-change="setSubfileFilter"
		:disabled="!currentProject"
		>
	</tabs>
</template>
