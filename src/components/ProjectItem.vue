<script>
'use strict'

import actions from '../store/actions'
import CurrentProject from './CurrentProject.vue'
import Popup from '../directives/Popup'
import ProjectIcon from './ProjectIcon.vue'
import Spinner from './Spinner.vue'
const notifier = require('node-notifier')


export default {
	components: {
		CurrentProject,
		ProjectIcon,
		Spinner,
	},

	directives: {
		'popup': Popup,
	},

	data() {
		return {
			wait: false,

			// upload url popover
			uploadUrlPopoverShown: false,
			uploadedUrl: '',
		}
	},

	props: {
		key: {},
		item: {},
		popoverShown: false,
	},

	vuex: {
		getters: {
			state(state) {
				return state
			},

			projects(state) {
				return state.subfiles.projects
			},

			currentKey(state) {
				return state.subfiles.current
			}
		},

		actions: {
			uploadToOst: actions.ost.uploadToOst,
		}
	},

	computed: {
		popupOptions() {
			return [
				{
					label: 'Delete...',
					click: () => this.onDeleteDialog()
				}
			]
		},

		fullPopupOptions() {
			let opts = this.popupOptions
			opts.push({
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				click: () => this.onCloseProject()
			})

			return opts
		}
	},

	events: {
		'project-wait': function(current, wait) {
			if(this.key !== current)
				return

			this.wait = wait
		},

		'subtitles-uploaded': function(current, url) {
			if(this.key !== this.currentKey)
				return

			this.uploadedUrl = url
			this.uploadUrlPopoverShown = true
		},

		'upload-to-ost': function(project, sub_path) {
			if(this.key !== project)
				return
			
			const currentProject = this.projects[project]

			this.wait = true

			const lang = currentProject.lang ? currentProject.lang : this.state.subfiles.default_lang
			console.log('we here at ost')

			this.uploadToOst({
				sub_path: sub_path,
				video_path: currentProject.video_path,
				lang,
				imdbid: currentProject.imdbid
			})
				.then(resp => {
					console.log(`result: ${JSON.stringify(resp)}`, resp.data)

					if(resp.alreadyindb) {
						return notifier.notify({title: 'The subtitles are already in the database', message: 'There is nothing to upload'})
					}

					// if we got the link to the uploaded subtitles
					if(typeof resp.data == 'string') {
						this.$dispatch('on-ost-url-ready', this.key, resp.data, this.$els.label)
						// this.$broadcast('subtitles-uploaded', this.currentKey, resp.data)
					}
			})
				.catch(err => {
					console.log(`error: ${JSON.stringify(err)}`)
					notifier.notify({title: `The subtitles couldn't be uploaded`, message: JSON.stringify(err)})
				})
				.finally(resp => {
					this.wait = false
				})
		},
	},

	methods: {
		onSelect() {
			this.$emit('on-select', this.key)
		},

		onDeleteDialog(e) {
			console.log(this.$els.label)
			this.$dispatch('on-delete', this.key, this.$els.label)

			if(e)
				e.stopPropagation()
		},

		onCloseProject() {
			this.$emit('on-close')
		},
	},

	ready() {

	},
}
</script>

<template>
	<div class="project-item" :class="{'active': item}" v-popup="item ? fullPopupOptions : popupOptions">
		<div @click="onSelect" class="project-item-header">
			<project-icon v-if="!wait" :video="projects[key].video_path"></project-icon>
			<spinner v-else size="normal" style="margin-top: -4px; margin-right: 3px;"></spinner>
			<label v-el:label>
				{{key}}
			</label>
		</div>

		<current-project
			v-if="item"
			:item="item"
			:container-width="containerWidth"
			>
		</current-project>

		<!-- <url-popover
			v-if="uploadUrlPopoverShown"
			@closed="uploadUrlPopoverShown = false"
			:initiator="$els.label"
			:description="key"
			:url="uploadedUrl"
			>
		</url-popover> -->
	</div>
</template>
