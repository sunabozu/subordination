<script>
'use strict'

import actions from '../store/actions'
import Modal from './Modal.vue'
import TabPanel from './TabPanel.vue'
import TabItem from './TabItem.vue'
import aButton from './aButton.vue'
import PathChooser from './PathChooser.vue'
import LoginModal from './LoginModal.vue'


export default {
	components: {
		Modal,
		TabPanel,
		'tab-item': TabItem,
		aButton,
		PathChooser,
		LoginModal,
	},

	data() {
		return {
			propertiesModel: {
				project_sort_order: undefined,
				default_lang: undefined,
			},

			projectSortOrder: [
				{value: 0, text: 'export name'},
				{value: 1, text: 'ussage'}
			],

			langDict: {},

			isLoginModalOpen: false,

			waitForLogin: false,
		}
	},

	vuex: {
		getters: {
			model(state) {
				return state
			},
		},

		actions: {
			setProjectSortOrder: actions.ui.setProjectSortOrder,
			setDefaultExportPath: actions.subfiles.setDefaultExportPath,
			setDefaultLanguage: actions.subfiles.setDefaultLanguage,

			verifyOstCredentials: actions.ost.verifyOstCredentials,
			setOstSll: actions.ost.setOstSll,

			setAutoUpdates: ({dispatch}, autoUpdates) => dispatch('SET_AUTO_UPDATES', autoUpdates),
		}
	},

	props: {
		open: {},
	},

	computed: {
		autoUpdatesParsed() {
			return this.model.ui.autoUpdates == 0 ? false : true
		}
	},

	methods: {
		onProjectSortOrder(e) {
			this.setProjectSortOrder(parseInt(e.target.value))
		},

		onDefaultExportPath(path) {
			console.log(path)
			this.setDefaultExportPath(path)
		},

		onDefaultLanguage(e) {
			this.setDefaultLanguage(e.target.value)
		},

		onClose() {
			console.log('on close')

			// if(this.isLoginModalOpen)
			// 	return

			this.$emit('close')
		},

		onSaveCredentials(credentials) {
			this.waitForLogin = true

			this.verifyOstCredentials(credentials)
				.then(resp => {
					new Notification('Success', {body: 'You can now export your subtitles to Opensubtitles.org'})
					this.isLoginModalOpen = false
					this.$emit('ost-enabled', true)
				})
				.catch(err => {
					new Notification('Error', {body: err})
					this.$emit('ost-enabled', false)
				})
				.finally(() => {
					this.waitForLogin = false
				})
		},

		onCloseLoginModal() {
			if(!this.waitForLogin)
				this.isLoginModalOpen = false
		},

		onOstSll(e) {
			console.log(actions.ost.setOstSll, this.setOstSll)
			this.setOstSll(e.target.checked)
		},

		onAutoUpdates(e) {
			this.setAutoUpdates(e.target.checked ? 1 : 0)
		}
	},

	ready() {
		this.propertiesModel.project_sort_order = this.model.ui.projectSortOrder
		this.propertiesModel.default_lang = this.model.subfiles.default_lang

		// the list is too larg, load it asynchronously
		setTimeout(() => {
			this.langDict = require('iso-639-2').all()
		}, 300)
	}
}
</script>

<template>
	<div>
	<modal id="prefModal" @on-close="onClose" :max-width="400">
		<tab-panel>
			<tab-item header="General">
				<div class="form-group">
					<label>Sort projects by:</label>
					<select class="form-control" v-model="propertiesModel.project_sort_order" @change="onProjectSortOrder">
						<option
							v-for="option in projectSortOrder"
							:value="option.value"
							>
							{{option.text}}
						</option>
					</select>
				</div>

				<div class="form-group">
					<label>Default export path:</label>
					<path-chooser
						:path="model.subfiles.export_path_default"
						@path-changed="onDefaultExportPath"
						>
					</path-chooser>
				</div>

				<div class="form-group">
					<label>Default language:</label>
					<select class="form-control" style="max-width: 100px;" v-model="propertiesModel.default_lang" @change="onDefaultLanguage">
						<option
							v-for="lang in langDict"
							:value="$key"
							>
							{{lang.name + ' [' + $key + ']'}}
						</option>
					</select>
				</div>

				<div class="form-group">
					<label>Automatically check for updates:</label>
					<input type="checkbox" :checked="autoUpdatesParsed" @change="onAutoUpdates"></input>
				</div>
			</tab-item>

			<tab-item header="Opensubtitles">
				<div class="form-group">
					<label>Credentials:</label>
					<button class="btn btn-mini btn-default" @click="isLoginModalOpen = true">
						{{model.ost.verified ? 'Change...' : 'Login...'}}
					</button>
				</div>

				<div class="form-group">
					<label>Use SSL:</label>
					<input type="checkbox" :checked="model.ost.ssl" @change="onOstSll"></input>
				</div>
			</tab-item>
		</tab-panel>

		<div class="form-footer">
			<a-button @click="onClose" autofocus="true">
				Close
			</a-button>
		</div>
	</modal>

	<login-modal
		v-if="isLoginModalOpen"
		transition="modal"
		@on-close="onCloseLoginModal"
		@on-save="onSaveCredentials"
		:wait="waitForLogin"
		description="Your password is stored encrypted, so if you want to change it, you need to re-enter it from scratch"
		:username="model.ost.username"
		>
	</login-modal>
</div>
</template>
