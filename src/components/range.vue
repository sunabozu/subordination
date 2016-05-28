<script>
'use strict'

export default {
	props: {
		value: {
			// type: Number,
			default: 0.00000
		},

		min: {
			type: Number,
			default: 0.0
		},

		max: {
			type: Number,
			default: 1.0
		},

		step: {
			type: Number,
			default: 0.00001
		}
	},

	computed: {

	},

	methods: {
		// for style purposes only
		onInput(event) {
			// this.$el.style.backgroundImage = `-webkit-gradient(linear, left top, right top, color-stop(${this.$el.value}, #2f55d2), color-stop(${this.$el.value}, #c2c0c2)`

			if(event)
				this.$emit('after-change', parseFloat(event.target.value))
		},

		onChange(event) {
			// this.$emit('after-change', parseFloat(event.target.value))
		}
	},

	ready() {
		// for style purposes only
		this.$watch('value', (newValue, oldValue) => {
			if(newValue != oldValue)
				this.onInput()
		})
	},
}
</script>

<template>
	<input type="range" :value="value" :min="min" :max="max" :step="step" @input="onInput | debounce 50"></input>
</template>
