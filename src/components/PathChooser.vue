<script>
'use strict'

import {remote} from 'electron'
import path from 'path'


export default {
	components: {

	},

	data: () => {
		return {
			selectedDir: '',
			alwaysSelected: 0,
		}
	},

	props: {
		path: {},
	},

	computed: {
		selectedDir() {

			if(typeof(this.path) !== 'string')
				return '';

			return path.basename(this.path)
		}
	},

	methods: {
		openDir(e) {
			let new_path = remote.dialog.showOpenDialog(remote.BrowserWindow.getFocusedWindow(), {
				title: 'Choose a default export path',
				defaultPath: this.path,
				properties: ['openDirectory'],
			})

			if(new_path) {
				this.$emit('path-changed', new_path[0])
			}

			this.alwaysSelected = 0

			e.preventDefault()
		}
	},

	ready() {
	},
}
</script>

<template>
	<select class="form-control" @change="openDir" v-model="alwaysSelected">
		<option value="0" selected>{{selectedDir}}</option>
		<optgroup></optgroup>
		<option>Other...</option>
	</select>
</template>
