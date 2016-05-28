<script>
'use strict'

import {remote} from 'electron'


export default {
	data: () => {
		return {
			padding: 10,
			// isOpen: false,
		}
	},

	props: {
		maxWidth: {
			default: 300
		},
	},

	methods: {
		onKeydown(e) {
			if(e.keyCode === 27) {
				console.log('esc')
				if(window.modalStack[window.modalStack.length - 1] !== this) // not our modal
					return

				console.log('its our modal')

				this.$dispatch('on-close')
			}
		},
	},

	events: {
	},

	ready() {
			const win = remote.getCurrentWindow()
			if(win) {
				win.setMaximizable(false)
				win.setClosable(false)
				win.setMovable(false)
				win.setResizable(false)
			}

			const element = this.$els.dialog

			let currentWidth = this.maxWidth >= document.clientWidth - this.padding * 2 ? document.clientWidth - this.padding * 2 : this.maxWidth
			element.style.minWidth = element.style.width = currentWidth + 'px'

			window.addEventListener('keydown', this.onKeydown)

			// add current modal to the global stack
			if(!window.modalStack)
				window.modalStack = []

			window.modalStack.push(this)
	},

	beforeDestroy() {
		window.modalStack.pop()
		window.removeEventListener('keydown',  this.onKeydown)

		if(window.modalStack.length < 1) {
			const win = remote.getCurrentWindow()
			if(win) {
				win.setMaximizable(true)
				win.setClosable(true)
				win.setMovable(true)
				win.setResizable(true)
			}
		}
	}

}
</script>

<template>
		<div>
			<!-- <div class="backdrop"></div> -->
			<div class="dialog" v-el:dialog>
				<slot></slot>
			</div>
		</div>
</template>
