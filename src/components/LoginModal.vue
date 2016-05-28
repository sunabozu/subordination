<script>
'use strict'

import Modal from './Modal.vue'
import Spinner from './Spinner.vue'


export default {
	components: {
		Modal,
		Spinner,
	},

	data() {
		return {

		}
	},

	props: {
		wait: {},
		username: {
			default: ''
		},
		description: {},
		password: {
			default: ''
		},
	},

	computed: {
		areCrdentialsLegit() {
			if(this.username.length < 3 || this.password.length < 3)
				return false
			else
				return true
		},
	},

	methods: {
		onSave() {
			this.$dispatch('on-save', {
				username: this.username,
				password: this.password
			})
		},

		onClose() {
			console.log('catched')
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
		:max-width="300"
		@on-close="onClose"
		id="loginModal"
		>
		<label v-if="description" style="word-wrap: break-word; white-space: normal; margin-bottom: 10px;">
			{{description}}
		</label>
		<div class="form-panel">
			<div class="form-group">
				<label>Username:</label>
				<input type="text" class="form-control" autofocus="true" v-model="username"></input>
			</div>
			<div class="form-group">
				<label>Password:</label>
				<input type="password" class="form-control" v-model="password"></input>
			</div>
		</div>

		<div style="align-items: center;">
			<spinner style="margin-top: 10px;" v-if="wait"></spinner>
			<div class="form-footer">
				<button class="btn btn-mini btn-default" @click="onClose" :disabled="wait">
					Cancel
				</button>
				<button class="btn btn-mini btn-default" @click="onSave" :disabled="wait || !areCrdentialsLegit">Login</button>
			</div>
		</div>
	</modal>
	</span>
</template>
