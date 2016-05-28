<script>
'use strict'

import actions from '../store/actions'
import Popover from './Popover.vue'
import aButton from './aButton.vue'


export default {
	components: {
		Popover,
		aButton,
	},

	data() {
		return {

		}
	},

	props: {
		project: {},
		initiator: {},
	},

	vuex: {
		getters: {
			currentSubfile(state) {
				return state.subfiles.current
			}
		},

		actions: {
			deleteProject: actions.subfiles.deleteProject,
			closeProject: actions.common.closeProject,
		}
	},

	computed: {

	},

	methods: {
		onDelete() {
			if(this.project === this.currentSubfile)
				this.closeProject()

			this.deleteProject(this.project)

			this.onCancel()
		},

		onCancel() {
			this.$dispatch('on-close')
		}
	},

	ready() {
		console.log('ready')
	},
}
</script>

<template>
	<div>
		<popover
			@closed="onCancel"
			:initiator="initiator"
			header="Are you sure you want to delete this project?"
			:description="key"
			:width="350"
			>
			<div class="form-footer">
				<button class="btn btn-mini btn-white" @click.stop="onCancel">
					Cancel
				</button>
				<a-button @click.stop="onDelete">
					Delete
				</a-button>
			</div>
		</popover>
	</div>
</template>
