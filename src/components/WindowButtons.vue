<script>
'use strict'

const remote = require('remote')


export default {
	components: {

	},

	data() {
		return {
			maximized: false,
		}
	},

	props: {

	},

	vuex: {
		getters: {

		},

		actions: {

		}
	},

	computed: {
		maximizeTitle() {
			return this.maximized ? 'Restore Down' : 'Maximize'
		}
	},

	methods: {
		onMinimize() {
			remote.getCurrentWindow().minimize()
		},

		onMaximize() {
			const win = remote.getCurrentWindow()

			if(win.isMaximized())
				win.unmaximize()
			else
				win.maximize()
		},

		onClose() {
			remote.getCurrentWindow().close()
		}
	},

	ready() {
		const win = remote.getCurrentWindow()

		win.on('maximize', () => {
			this.maximized = true
		})

		win.on('unmaximize', () => {
			this.maximized = false
		})

		this.maximized = win.isMaximized()
		console.log('maximized', this.maximized)
	},
}
</script>

<template>
	<div class="btn-group btn-win pull-right">
		<button
			class="btn btn-default btn-win btn-minimize"
			title="Minimize"
			@click="onMinimize"
			>
		</button>
		<button
			class="btn btn-default btn-win"
			:class="{'btn-maximize': !maximized, 'btn-unmaximize': maximized}"
			:title="maximizeTitle"
			@click="onMaximize"
			>
		</button>
		<button
			class="btn btn-default btn-win btn-close"
			title="Close"
			@click="onClose"
			>
		</button>
	</div>
</template>
