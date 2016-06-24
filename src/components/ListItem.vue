<script>
'use strict'


export default {
	data: () => {
		return {
			clicked: false
		}
	},

	props: {
		active: {
			type: Boolean
		},

		ready: {
			type: Boolean
		}
	},

	methods: {
		onMousedown() {
			// make focus coming not from trans-input
			this.clicked = true

			// this.onClick(this.item)
		},

		onFocus(e) {
			// if coming from trans-input, return focus back
			// but not if it came by click (see onMousedown)
			if(!this.clicked && e.relatedTarget && e.relatedTarget.id === 'trans-input') {
				setTimeout(() => {
					e.relatedTarget.focus()
				}, 10)

			}
			else
				this.clicked = false
		}
	},

	ready: function() {
		// focus item after loading if it's active
		// if(this.active)
		// 	this.$el.focus()

		this.$watch('active', function(value) {
			if(value)
				this.$el.focus()
		})
	}
}
</script>

<template>
	<li
		class="list-group-item"
		:class="{'active': active, 'ready': ready}"
		@focus="onFocus"
		@mousedown="onMousedown"
		>
		<slot></slot>
	</li>
</template>
