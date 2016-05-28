<script>
'use strict'

import Vue from 'vue'

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
		onMousedown(event) {
			// make focus coming not from trans-input
			this.clicked = true

			// this.onClick(this.item)
		},
		//
		// onUp(event) {
		// 	this.moveItem(this.item, 'prev')
		// },
		//
		// onDown(event) {
		// 	this.moveItem(this.item, 'next')
		// },
		//
		onFocus(event) {
			// if coming from trans-input, return focus back
			// but not if it came by click (see onMousedown)
			if(!this.clicked && event.relatedTarget && event.relatedTarget.id === 'trans-input') {
				setTimeout(() => {
					event.relatedTarget.focus()
				}, 10)

			}
			else
				this.clicked = false
		}
	},

	ready: function() {
		// focus item after loading if it's active
		if(this.active)
			this.$el.focus()

		this.$watch('active', function(value) {
			console.log('active!', value);
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
