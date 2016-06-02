<script>
'use strict'

export default {
	props: {
		initiator: {},
		header: {},
		description: {},
		width: {},
		arrow: {
			default: true
		},
	},

	computed: {

	},

	methods: {
		insideClick(e) {
			e.stopPropagation()
		},

		onClose(e) {
			console.log(e)
			window.removeEventListener('mousedown', this.onClose)
			window.removeEventListener('resize', this.onClose)
			window.removeEventListener('keydown', this.onKeydown)
			this.$emit('closed')
		},

		onKeydown(e) {
			if(e.keyCode === 27)
				this.onClose(e)
		}
	},

	ready() {
		console.log(this.width)
		if(this.width)
			this.$els.popover.style.width = this.width + 'px'

		window.addEventListener('mousedown', this.onClose)
		window.addEventListener('resize', this.onClose)
		window.addEventListener('keydown', this.onKeydown)

		// calculate the initial point
		if(this.initiator) {
			const bound = this.initiator.getBoundingClientRect()
			let top = bound.top - this.initiator.clientHeight / 2 - 12

			// in case it's too low
			let bottom = document.body.clientHeight - (this.$els.popover.getBoundingClientRect().height + top)
			if(bottom < 0) {
				top += bottom - 5
				this.$els.arrow.style.top = 20 - (bottom - 5) + 'px'
			}

			this.$el.style.top = top + 'px'
			this.$el.style.left = bound.left + this.initiator.clientWidth + 14 + 'px'
		} else { // display it in the center
			this.$el.style.top = (window.innerHeight - this.$els.popover.getBoundingClientRect().height) / 2 + 'px'
			this.$el.style.left = (window.innerWidth - this.width) / 2 + 'px'
		}
	},
}
</script>

<template>
	<!-- <div > -->
		<div class="popover arrow-left" @mousedown="insideClick" @contextmenu.stop="" v-el:popover>
			<div v-if="arrow" class="arrow" v-el:arrow></div>
			<h1>{{header}}</h1>
			<div class="light">{{description}}</div>
			<hr />
			<slot></slot>
		</div>
	<!-- </div> -->
</template>
