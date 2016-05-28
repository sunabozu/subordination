<script>
'use strict'

import actions from '../store/actions'


export default {
	props: {
		model: {
			// type: Object,
			required: true
		},
	},

	vuex: {
		actions: {
			updateSubtitle: actions.subfiles.updateSubtitle,
		}
	},

	computed: {
		currentValue() {
			if(this.model && this.model.items.length > 0 && this.model.current_index >= 0)
				return this.model.items[this.model.current_index].text_trans
			else
				return null
		}
	},

	methods: {
		updateValue(event) {
			if(!this.model)
				return;

			this.updateSubtitle(this.model.current_index, event.target.value)
		}
	},

	ready() {
	},
}
</script>

<template>
	<textarea id="trans-input" :value="currentValue" @input="updateValue" :disabled="currentValue == null"></textarea>
</template>
