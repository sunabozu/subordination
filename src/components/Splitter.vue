<script>
'use strict'


// vertical by default
export default {
	props: {
		orientation: {},
	},

	computed: {
		isHorizontal() {
			return this.orientation === 'horizontal'
		}
	},

	methods: {
		onStart(event) {
			let minPrev = 0
			let minNext = 0

			if(this.isHorizontal) {
				minPrev = window.getComputedStyle(this.$el.previousElementSibling, null).getPropertyValue('min-height')
				minNext = window.getComputedStyle(this.$el.nextElementSibling, null).getPropertyValue('min-height')

				// change cursor for both panes
				this.$el.previousElementSibling.style.cursor = 'row-resize'
				this.$el.nextElementSibling.style.cursor = 'row-resize'

			} else {
				minPrev = window.getComputedStyle(this.$el.previousElementSibling, null).getPropertyValue('min-width')
				minNext = window.getComputedStyle(this.$el.nextElementSibling, null).getPropertyValue('min-width')

				// change cursor for both panes
				this.$el.previousElementSibling.style.cursor = 'col-resize'
				this.$el.nextElementSibling.style.cursor = 'col-resize'
			}

			minPrev = parseInt(minPrev.substring(0, minPrev.length - 2))
			minNext = parseInt(minNext.substring(0, minNext.length - 2))

			const moveListener = (moveEvent) => {
				const brect = this.$el.previousElementSibling.getBoundingClientRect()

				let result = 0
				if(this.isHorizontal) {
					result = moveEvent.clientY - brect.top

				} else {
					result = moveEvent.clientX - brect.left
				}

				if(!minPrev || result >= minPrev) {
					if((this.isHorizontal && this.$el.nextElementSibling.clientWidth <= minNext) ||
						(!this.isHorizontal && this.$el.nextElementSibling.clientHeight <= minNext))
						return

					if(this.isHorizontal)
						this.$el.previousElementSibling.style.height = result + 'px'
					else
						this.$el.previousElementSibling.style.width = result + 'px'

					this.$dispatch('on-change', result)
					this.$root.$broadcast('splitter-resize')
				}
			}

			const upListener = (upEvent) => {
				// return default cursor
				this.$el.previousElementSibling.style.cursor = 'auto'
				this.$el.nextElementSibling.style.cursor = 'auto'

				// cleanup
				window.removeEventListener('mousemove', moveListener)
				window.removeEventListener('mouseup', upListener)
			}

			window.addEventListener('mousemove', moveListener)
			window.addEventListener('mouseup', upListener)
		}
	},

	ready: function() {
	}
}
</script>

<template>
	<div :class="{'splitter-v': !isHorizontal, 'splitter-h': isHorizontal}" v-on:mousedown="onStart"></div>
</template>
