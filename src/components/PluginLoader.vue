<script>
'use strict'

export default {
	components: {

	},

	props: {

	},

	computed: {

	},

	methods: {
		onIpcMessage(event) {
			console.log('event:', event)

			if(event.channel == 'error') {
				console.log('success', event.args[0])
			}

			if(event.channel == 'success') {
				console.log('success')
				new Notification('Success!', {body: 'The video module is loaded and ready for work'})
				this.$dispatch('plugins-ready')
			}
		}
	},

	ready() {
		this.$els.webview.addEventListener('ipc-message', this.onIpcMessage)
	},

	beforeDestroy() {
		this.$els.webview.removeEventListener('ipc-message', this.onIpcMessage)
	}
}
</script>

<template>
	<webview
		v-el:webview
		src="./plugin_loader.html"
		style="position: absolute; left: 0; right: 0; top: 50%; bottom: 50%; margin: auto; height: 80px;"
		@ipc-message="onIpcMessage"
		nodeintegration
		blinkfeatures="CSSVariables"
		>
	</webview>
</template>
