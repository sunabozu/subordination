<script>
'use strict'

import NonMovable from '../mixins/NonMovable'


export default {
	mixins: [
		NonMovable,
	],
	
	props: {
		choices: {
			type: Array,
			required: true
		},

		model: {},

		disabled: {}
	},

	computed: {

	},

	methods: {
		onChange(choice) {
			if(this.model !== choice)
				this.$emit('on-change', choice.key)
		}
	},

	ready() {

	},
}
</script>

<template>
	<div class="btn-group tabs">
		<button
			v-for="choice in choices"
			class="btn btn-default"
			:class="{'active': choice.key == model && !disabled}"
			@click="onChange(choice)"
			:disabled="disabled"
			>
			{{choice.text}}
		</button>
	</div>
</template>
