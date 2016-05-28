<script>
'use strict'

import Vue from 'vue'
import actions from '../store/actions'
import Modal from './Modal.vue'
import Range from './range.vue'
import VProgress from './VProgress.vue'
import Spinner from './Spinner.vue'
import aButton from './aButton.vue'


export default {
	components: {
		Modal,
		Range,
		VProgress,
		Spinner,
		aButton,
	},

	data() {
		return {
			shift: 0,

			negativeShiftPolicy: [
				{value: 0, text: 'remove'},
				{value: 1, text: 'shift to beginning'}
			],

			negativeShiftModel: 0,
		}
	},

	props: {

	},

	vuex: {
		actions: {
			shiftSubtitles: actions.subfiles.shiftSubtitles,
		}
	},

	computed: {
		wait() {
			if(this.shift == 0)
				return true
		}
	},

	methods: {
		onShift() {
			if(this.shift === 0)
				return

			setTimeout(() => {
				console.log(this.shift)
				this.shiftSubtitles(this.shift, this.negativeShiftModel)
			}, 250)

			this.$dispatch('on-close')
		},

		onClose() {
			if(this.wait)
				return

			this.$dispatch('on-close')
		}
	},

	ready() {

	},
}
</script>

<template>
	<span>
	<modal
		:max-width="450"
		@on-close="onClose"
		>
		<label style="word-wrap: break-word; white-space: normal; margin-bottom: 10px;">
			When using negative values be careful, you can lose some titles at the beginning. Time is represented in millisecond (1000 ms = 1 s).
		</label>
		<div class="form-panel">
			<div class="form-group" style="align-items: center;">
				<range v-model="shift" :step="100" :min="-10000" :max="10000" :value="shift" style="flex-grow: 1; height: 3px; margin-right: 10px;"></range>
				<input type="text" class="form-control" style="max-width: 65px;" v-model="shift"></input>
			</div>

			<div class="form-group">
				<label>In case of negative timestamps:</label>
				<select class="form-control" v-model="negativeShiftModel">
					<option
						v-for="option in negativeShiftPolicy"
						:value="option.value"
						>
						{{option.text}}
					</option>
				</select>
			</div>
		</div>

		<div class="form-footer">
			<button class="btn btn-mini btn-default" @click="$dispatch('on-close')">
				Cancel
			</button>
			<a-button @click="onShift" :disabled="wait">Shift</a-button>
		</div>
	</modal>
	</span>
</template>
