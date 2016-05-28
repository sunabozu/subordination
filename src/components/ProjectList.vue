<script>
'use strict'

import Vue from 'vue'
import ProjectItem from './ProjectItem.vue'
// import CircleGraph from './CircleGraph.vue'


export default {
	components: {
		ProjectItem,
		// CircleGraph,
	},

	data: function() {
		return {
		}
	},

	props: {
		model: {
			type: Object,
			required: true
		},

		sortBy: {
			coerce(value) {
				switch(value) {
					case 0:
						return {field: 'export_name', desc: 1}
					case 1:
						return {field: 'open_date', desc: -1}
					default:
						return {field: 'export_name', desc: 1}
				}
			}
		},

		containerWidth: {
			type: Number,
		}
	},

	computed: {
		currentItem() {
			if(this.model.current) {
				return {
					name: this.model.current,
					value: this.model.projects[this.model.current]
				}
			} else
				return null
		}
	},

	methods: {
		onSelect(key) {
			if(key !== this.model.current)
				this.$emit('on-change', key)
		},

		onClose() {
			this.$emit('on-close')
		}
	},

	ready() {

	},

	replace: false
}
</script>

<template>
	<!-- <circle-graph
		v-if="currentItem && currentItem.value.items.length"
		:value="currentItem.value.translated / currentItem.value.items.length"
		:dimensions="60"
		style="height: 60px"
		:title="currentItem.name"
		>
	</circle-graph> -->

	<template v-for="item in model.projects | orderBy sortBy.field sortBy.desc">
		<project-item
			:key="$key"
			:item="$key == model.current && currentItem ? currentItem : null"
			@on-select="onSelect"
			@on-close="onClose"
			>
		</project-item>
	</template>
</template>
