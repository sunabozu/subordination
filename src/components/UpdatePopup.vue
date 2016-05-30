<script>
'use strict'

const ipc = require('electron').ipcRenderer


import aButton from './aButton.vue'
import Popover from './Popover.vue'


export default {
	components: {
		aButton,
		Popover,
	},

	methods: {
		installUpdates() {
			ipc.send('msg-bus', {
				type: 'install-update'
			})

			this.$emit('closed')
		},
	},
}
</script>

<template>
	<div>
		<popover
			:initiator="initiator"
			:arrow="false"
			header="There are updates avaliable"
			description="Would you like to install them?"
			:width="250"
			@closed="$emit('closed')"
			>

			<div class="form-footer">
				<button class="btn btn-mini btn-white" @click.stop="$emit('closed')">
					Cancel
				</button>
				<a-button @click.stop="installUpdates">
					Install now...
				</a-button>
			</div>
		</popover>
	</div>
</template>
