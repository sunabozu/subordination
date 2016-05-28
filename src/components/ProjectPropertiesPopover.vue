<script>
'use strict'

import actions from '../store/actions'
import iButton from './iButton.vue'
import Popover from './Popover.vue'
import Spinner from './Spinner.vue'
import aButton from './aButton.vue'


const imdbid_re = /^tt\d{7}$/

export default {
	components: {
		iButton,
		Popover,
		Spinner,
		aButton,
	},

	data() {
		return {
			emptyTitlesPolicy: [
				{value: 0, text: 'Replace with original'},
				{value: 1, text: 'Ignore'}
			],

			langDict: {},

			propertiesModel: {
				export_name: '',
				export_mode: 0,
				lang: '0', // default
				imdbid: '',
			},

			imdbSearching: false,
		}
	},

	props: {
		initiator: {}
	},

	vuex: {
		getters: {
			item(state) {
				return state.subfiles.projects[state.subfiles.current]
			},

			projectName(state) {
				return state.subfiles.current
			},

			ostVerified(state) {
				return state.ost.verified
			}
		},

		actions: {
			changeProjectProperties: actions.subfiles.changeProjectProperties,

			getOstMetadata: actions.ost.getOstMetadata,
		}
	},

	computed: {
		propertiesValid() {
			if(5 > this.propertiesModel.export_name.length > 250)
				return false

			if(this.propertiesModel.imdbid && !imdbid_re.exec(this.propertiesModel.imdbid))
				return false

			return true
		}
	},

	methods: {
		saveProperties() {
			if(this.propertiesModel.lang === '0') // if default
				this.propertiesModel.lang = null

			this.changeProjectProperties(this.propertiesModel)
			console.log(this.propertiesModel)

			this.onClose()
		},

		getMetadata() {
			this.imdbSearching = true

			const promise = this.getOstMetadata(this.item.video_path)
			if(!promise) {
				this.imdbSearching = false
				return
			}

			promise
				.then(resp => {
					if(resp.metadata && resp.metadata.imdbid) {
						this.propertiesModel.imdbid = resp.metadata.imdbid
						this.$els.imdbid.focus()

						new Notification('The video file is identified successfully', {body: resp.metadata.title})
					} else {
						new Notification(`The video file couldn't be identificated`, {body: 'You need to ented an IMDB id by yourself'})
					}
				})
				.catch(err => {
					console.log(err)
					new Notification('Error', {body: 'There are network problems'})
				})
				.finally(resp => {
					this.imdbSearching = false
				})
		},

		onClose() {
			this.$dispatch('on-close')
		},
	},

	ready() {
		// create model
		this.propertiesModel.export_name = this.item.export_name
		this.propertiesModel.export_mode = this.item.export_mode
		this.propertiesModel.lang = this.item.lang ? this.item.lang : '0'
		this.propertiesModel.imdbid = this.item.imdbid ? this.item.imdbid : ''

		// the list is too larg, load it asynchronously
		setTimeout(() => {
			let isoDict = require('iso-639-2').all()
			isoDict['0'] = {name: 'default'}

			this.langDict = isoDict
		}, 300)
	},
}
</script>

<template>
	<div>
		<popover
			:initiator="initiator"
			@closed="onClose"
			:initiator="$els.propertyButton"
			:header="projectName"
			description="Edit project properties"
			:width="250"
			>
			<div class="form-group">
				<label>Result file name:</label>
				<input
					class="form-control"
					type="text"
					v-model="propertiesModel.export_name"
					placeholder="Input a file name"
					>
				</input>
			</div>

			<div class="form-group">
				<label>Empty titles policy:</label>
				<select class="form-control" v-model="propertiesModel.export_mode">
					<option
						v-for="option in emptyTitlesPolicy"
						:value="option.value"
						>
						{{option.text}}
					</option>
				</select>
			</div>

			<div class="form-group">
				<label>Language:</label>
				<select class="form-control" v-model="propertiesModel.lang">
					<option
						v-for="option in langDict"
						:value="$key"
						>
						{{option.name + ($key !== '0' ? ' [' + $key + ']' : '')}}
					</option>
				</select>
			</div>

			<div class="form-group">
				<div style="display: flex; justify-content: space-between;">
					<label>IMDB id of the movie/episode:</label>
					<i-button v-if="!imdbSearching" class="btn-micro" :disabled="!item.video_path || !ostVerified" icon="search" @click="getMetadata" title="Try to obrain an IMDB id automatically">
					</i-button>
					<spinner v-else></spinner>
				</div>
				<input
					class="form-control"
					type="text"
					v-model="propertiesModel.imdbid"
					placeholder="e.g. tt3205376"
					v-el:imdbid
					>
				</input>
			</div>

			<div class="form-footer">
				<button class="btn btn-mini btn-white" @click="onClose">
					Cancel
				</button>
				<a-button @click="saveProperties" :disabled="!propertiesValid">
					Save
				</a-button>
			</div>
		</popover>
	</div>
</template>
