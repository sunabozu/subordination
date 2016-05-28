<script>
'use strict'

import {ms2obj} from '../utils/time'


export default {
	components: {

	},

	props: {
		model: {
			default: 612134
		}
	},

	computed: {
		time() {
			return ms2obj(this.model, true)
		}
	},

	methods: {
		onChange(e) {
			// adjust visible length
			const diff = parseInt(e.target.getAttribute('len')) - e.target.value.length

			if(diff > 0) {
				for(let i = 0; i < diff; i++)
					e.target.value = '0' + e.target.value
			}

			// change the model
			this.model = parseInt(this.$els.hours.value) * 3600000 +
				parseInt(this.$els.minutes.value) * 60000 +
				parseInt(this.$els.seconds.value) * 1000 +
				parseInt(this.$els.ms.value)
		}
	},

	ready() {

	},
}
</script>

<template>
	<div>
		<input type="number" v-el:hours class="form-control" @change="onChange" len="2" min="0" step="1" max="10" :value="time.hours">
		<input type="number" v-el:minutes class="form-control" @change="onChange" len="2" min="0" step="1" max="59" :value="time.minutes">
		<input type="number" v-el:seconds class="form-control" @change="onChange" len="2" min="0" step="1" max="59" :value="time.seconds"> .
		<input type="number" v-el:ms class="form-control" @change="onChange" len="3" min="0" step="100" max="999" :value="time.milliseconds">
	</div>
</template>
