<script>
'use strict'

const {shell, clipboard} = require('electron')
// const clipboard = require('electron').clipboard
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
		initiator: {},
		description: {},
		url: {},
	},

	computed: {

	},

	methods: {
		openUrl() {
			shell.openExternal(this.url)
			this.$emit('closed')
		},

		copyToClipboard() {
			clipboard.writeText(this.url)
			this.$emit('closed')
		},
	},

	beforeDestroy() {
	},

	ready() {
		setTimeout(() => {
			this.$els.input.focus()
			this.$els.input.select()
		}, 100)


	},
}
</script>

<template>
	<div>
		<popover
			:initiator="initiator"
			header="Subtitles are available by the following URL"
			:description="description"
			:width="350"
			@closed="$emit('closed')"
			>
			<input
				v-el:input
				class="form-control"
				type="text"
				autofocus="true"
				:value="url"
				>
			</input>

			<div class="form-footer">
				<button class="btn btn-mini btn-white" @click.stop="$emit('closed')">
					Cancel
				</button>
				<button class="btn btn-mini btn-white" @click.stop="copyToClipboard">
					Copy
				</button>
				<a-button @click.stop="openUrl">
					Open...
				</a-button>
			</div>
		</popover>
	</div>
</template>
