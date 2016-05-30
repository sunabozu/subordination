<script>
'use strict'

import {remote, ipcRenderer as ipc} from 'electron'
import path from 'path'
// import Vue from 'vue'
import {createApplicationMenu, enableItems} from './utils/MainMenu'
import dialog from './utils/dialog'

import store from './store'
import actions from './store/actions'

import SubList from './components/SubList.vue'
import SubFilter from './components/SubFilter.vue'
import ProjectList from './components/ProjectList.vue'
import VideoView from './components/VideoView.vue'
import Modal from './components/Modal.vue'
import Bottom from './components/Bottom.vue'
import VProgress from './components/VProgress.vue'
import Splitter from './components/Splitter.vue'
import TransInput from './components/TransInput.vue'
import iButton from './components/iButton.vue'
import PreferencesModal from './components/PreferencesModal.vue'
import ShiftModal from './components/ShiftModal.vue'
import NewTitleModal from './components/NewTitleModal.vue'
import ProjectPropertiesPopover from './components/ProjectPropertiesPopover.vue'
import ProjectDeletePopover from './components/ProjectDeletePopover.vue'
import UrlPopover from './components/UrlPopover.vue'
import UpdatePopup from './components/UpdatePopup.vue'
import WindowButtons from './components/WindowButtons.vue'

import Popup from './directives/Popup'
import Dropzone from './directives/Dropzone'
import Dropdown from './directives/Dropdown'

import './filters/escape'
import './filters/time'

import {dict_to_srt} from './utils/srt'


export default {
	el: 'body',

	components: {
		SubList,
		SubFilter,
		ProjectList,
		VideoView,
		Modal,
		Bottom,
		VProgress,
		Splitter,
		TransInput,
		iButton,
		PreferencesModal,
		ShiftModal,
		NewTitleModal,
		ProjectPropertiesPopover,
		ProjectDeletePopover,
		UrlPopover,
		UpdatePopup,
		WindowButtons,
	},

	directives: {
		Popup,
		Dropzone,
		Dropdown,
	},

	store,

	vuex: {
		actions: {
			initPlayer: actions.player.initPlayer,
			unloadVideoFile: actions.player.unloadVideoFile,
			playerPlay: actions.player.play,
			playerPause: actions.player.pause,

			openSubfile: actions.subfiles.openSubfile,
			setCurrentProject: actions.subfiles.setCurrentProject,
			deleteCurrentSubtitle: actions.subfiles.deleteCurrentSubtitle,
			reindexSubfile: actions.subfiles.reindexSubfile,
			changeProjectExportName: actions.subfiles.changeProjectExportName,
			changeProjectExportPath: actions.subfiles.changeProjectExportPath,
			setSubfileFilter: actions.subfiles.setSubfileFilter,

			loadSubfile: actions.common.loadSubfile,
			loadState: actions.common.loadState,
			setVideoFile: actions.common.setVideoFile,
			closeProject: actions.common.closeProject,

			uploadToOst: actions.ost.uploadToOst,

			setLeftPanelWidth: actions.ui.setLeftPanelWidth,
			setCentralPanelWidth: actions.ui.setCentralPanelWidth,
			setVideoViewHeight: actions.ui.setVideoViewHeight,
		}
	},

	data() {
		return {
			appIsReady: false,

			preferencesModalShown: false,
			shiftModalShown: false,
			newTitleModalShown: false,

			newTitleMode: 'after_current',

			captureBegin: null,
			captureFinnish: null,

			projectProperiesShown: false,
			projectProperiesInitiator: null,

			projectDeleteShown: false,
			projectDeleteInitiator: null,
			projectToDelete: null,

			uploadUrlPopoverShown: false,
			uploadUrlPopoverInitiator: null,
			uploadUrlDescription: null,
			uploadedUrl: null,

			updatePopupShown: false,

			mainMenu: null,
		}
	},

	computed: {
		state() {
			return this.$store.state
		},

		platform() {
			return process.platform
		},

		currentProject() {
			console.log(this.state)
			const project_open = this.state.subfiles.projects[this.state.subfiles.current] ? true : false
			let title_selected = false
			const video_plugin = this.state.player.plugins_exist
			const ost = this.state.ost.verified
			let imdbid = false
			let video_loaded = false

			let capture_began = this.captureBegin != null

			if(this.state.subfiles.projects[this.state.subfiles.current]) {
				title_selected = this.state.subfiles.projects[this.state.subfiles.current].current_index >= 0 ? true : false

				if(this.state.subfiles.projects[this.state.subfiles.current].video_path)
					video_loaded = true

				if(this.state.subfiles.projects[this.state.subfiles.current].imdbid)
					imdbid = true
			}

			setTimeout(() => {
				console.log('enabled: ', ost, video_loaded, imdbid)
				enableItems([
					{name: 'load-video', enabled: project_open && video_plugin},
					{name: 'save', enabled: project_open},
					{name: 'export', enabled: project_open},
					{name: 'export-as', enabled: project_open},
					{name: 'upload-to-ost', enabled: project_open && ost && video_loaded && imdbid},
					{name: 'close', enabled: project_open},

					{name: 'add-new-title-after-current', enabled: project_open},
					{name: 'add-new-title-at-end', enabled: project_open},
					{name: 'capture-begin', enabled: project_open && video_loaded && !capture_began},
					{name: 'capture-finish', enabled: project_open && video_loaded && capture_began},
					{name: 'capture-cancel', enabled: project_open && video_loaded && capture_began},
					{name: 'edit-current-title', enabled: project_open && title_selected},
					{name: 'delete-current-title', enabled: project_open && title_selected},
					{name: 'reindex', enabled: project_open},
					{name: 'shift', enabled: project_open},

					{name: 'prev-title', enabled: project_open},
					{name: 'next-title', enabled: project_open},
				])
			}, 100)

			return this.state.subfiles.projects[this.state.subfiles.current]
		},
	},

	methods: {
		onCanvasReady(canvas) {
			const result = this.initPlayer(canvas)

			if(!result) { // everything is fine
				this.$broadcast('plugins-not-ready', false)
				return
			}

			if(result === 2) { // it means there is no webchimera module, so download it
				this.$broadcast('plugins-not-ready', true)
			}
		},

		onSetSubFile(sub_path) {
			if(!sub_path || sub_path.constructor !== Array) {
				sub_path = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
					title: 'Open a file with subtitles...',
					// defaultPath: this.path,
					properties: ['openFile'],
					filters: [
						{name: 'Subtitles', extensions: ['srt']},
						{name: 'All Files', extensions: ['*']}
					]
				})
			}

			console.log(sub_path)

			if(!sub_path || this.currentProject == sub_path[0])
				return

			if(this.state.subfiles.current)
				this.saveSubfile()

			console.log('saved')

			this.unloadVideoFile()

			console.log('video unloaded')

			this.openSubfile(sub_path[0])
				.catch(err => {
					console.log('error:', err)
					setTimeout(() => {
						dialog.error('Oops, something wrong has happened', err)
					}, 200)
				})
		},

		onSetVideoFile(video_path) {
			if(!this.currentProject)
				return

			if(!video_path || video_path.constructor !== Array) {
				video_path = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
					title: 'Open a video file...',
					properties: ['openFile'],
					filters: [
						{name: 'Video files', extensions: ['mp4', 'mkv', 'avi', 'webm', '3gp', 'flv']},
						{name: 'All Files', extensions: ['*']}
					]
				})
			}

			if(!video_path || this.currentProject.video_path == video_path[0])
				return

			this.setVideoFile(video_path[0])
		},

		openModal() {
			// this.$broadcast('open-modal', 'some')
			this.preferencesModalShown = true
		},

		openShiftModal() {
			this.shiftModalShown = true
		},

		openNewTitleModal(mode) { // mode: after_current, end, edit, time_marks
			if(!this.currentProject)
				return

			this.newTitleMode = mode
			this.newTitleModalShown = true
		},

		openAboutDialog() {
			ipc.send('msg-bus', {type: 'open-about-dialog'})
		},

		closeNewTitleModal() {
				this.newTitleModalShown = false
				this.onCapture('cancel')
		},

		onCapture(action) {
			switch(action) {
				case 'begin':
					this.playerPlay()
					this.captureBegin = this.state.player.current_time
					console.log(this.captureBegin)
					break

				case 'finish':
					this.playerPause()
					this.captureFinnish = this.state.player.current_time

					this.openNewTitleModal('time_marks')
					break

				case 'cancel':
					this.captureBegin = null
					this.captureFinnish = null
					break
			}
		},

		saveState() {
			if(Object.keys(this.state.subfiles.projects).length == 0) {
				console.log('there are no projects to save, suspecting error')
				return
			}

			this.saveSubfile()
			const stateSerialized = JSON.stringify(this.state, (key, value) => {
				if(key === 'items' && value.length > 0 && value[0].text_orig != undefined)
					return []
				if(key === 'plugins_exist') // no need to save it, it's checked on each run
					return undefined
				else
					return value
			})

			// const subfileSerialized = JSON.stringify(subfile)

			ipc.send('msg-bus', {
				type: 'save-state',
				state: stateSerialized,
			})

			// if(remote.app.mainWindow)
			try {
				remote.getCurrentWindow().setDocumentEdited(false)
			} catch(e) {
				console.log(e)
			}
		},

		saveSubfile() {
			console.log(this.state.subfiles.current, this.state.subfiles.projects)

			if(!this.state.subfiles.current || !this.currentProject) {
				console.log('there is no subfile to save')
				return
			}

			if(this.currentProject.items.length == 0) {
				// TODO: ask if user wants to save an empty file, or maybe that is a bad idea
				return
			}

			let subfile = {}
			Object.assign(subfile, this.currentProject)
			const subfileSerialized = JSON.stringify(subfile)

			ipc.send('msg-bus', {
				type: 'save-subfile',
				subfile: subfileSerialized,
				subfileName: this.state.subfiles.current
			})
		},

		switchProject(name) {
			console.log(name)
			// save and close current subfile
			this.onCloseProject()

			// switch project
			this.setCurrentProject(name)

			this.$nextTick(() => {
				// load new subfile
				ipc.send('msg-bus', {
					type: 'load-subfile',
					subfileName: this.state.subfiles.current
				})
			})
		},

		onCloseProject() {
			this.saveSubfile()
			this.closeProject()
		},

		onDeleteTitle() {
			this.deleteCurrentSubtitle()
		},

		onReindexSubfile() {
			this.reindexSubfile()
		},

		onExportAs() {
			if(!this.currentProject)
				return

			const default_path = this.currentProject.export_path ? this.currentProject.export_path :  this.state.subfiles.export_path_default

			console.log(this.currentProject.export_name)

			const export_path = remote.dialog.showSaveDialog(remote.BrowserWindow.getFocusedWindow(), {
				title: 'Export the current project...',
				// defaultPath: this.path,
				defaultPath: path.join(default_path, this.currentProject.export_name),
				filters: [
					{name: 'Subtitles', extensions: ['srt']},
					{name: 'All Files', extensions: ['*']}
				]
			})

			if(!export_path)
				return

			this.changeProjectExportName(path.basename(export_path))

			// change export path for this project if it differs from default
			if(export_path != this.state.subfiles.export_path_default)
				this.changeProjectExportPath(path.dirname(export_path))
			else
				this.changeProjectExportPath(null)

			this.onExport()
		},

		onExport(silent) {
			if(!this.state.subfiles.current || !this.currentProject) {
				console.log('there is no subfile to export')
				return // error
			}

			let result = dict_to_srt(this.currentProject.items,
				this.currentProject.export_mode)
			// console.log(result);

			if(result == '') { // if there is nothing to export
				dialog.warning('There is nothing to export', 'Try to change the empty title policy in the properties of this project')
				return // error
			}

			const export_path = this.currentProject.export_path ? this.currentProject.export_path :  this.state.subfiles.export_path_default

			// save the actual file
			const full_path = path.join(export_path, this.currentProject.export_name)
			ipc.send('msg-bus', {
				type: 'save-file',
				content: result,
				path: full_path,
				silent
			})

			console.log('exported')
			return full_path
		},

		onUploadToOst() {
			const current = this.state.subfiles.current

			if(!this.currentProject) {
				dialog.warning('There is no opened project to upload', 'Open some project and try again')
				return
			}
			if(!this.currentProject.video_path) {
				dialog.warning(`The current project doesn't contain a video file`, 'Add a video file and try again')
				return
			}
			if(!this.currentProject.imdbid) {
				dialog.warning(`The current poject doesn't contain a valid IMDB id`, `IMDB id is required for correct identification of your subtitles. Add it in the properties of the project.`)
				return
			}

			// this.$broadcast('project-wait', current, true)

			console.log('upload')

			// subscribe on file-save event
			ipc.once('msg-bus', (event, msg) => {
				this.$broadcast('upload-to-ost', current, msg.path)
			})

			// export subtitles first
			if(!this.onExport(true)) // silent mode
				this.$broadcast('project-wait', current, false)
		},

		onShowProjectProperties(el) {
			this.projectProperiesInitiator = el
			this.projectProperiesShown = true
		},

		onShowProjectDelete(name, initiator) {
			console.log(name, initiator)
			this.projectDeleteInitiator = initiator
			this.projectToDelete = name
			this.projectDeleteShown = true
		},

		onShowOstUploaded(key, url, initiator) {
			console.log(url)
			this.uploadUrlPopoverInitiator = initiator
			this.uploadedUrl = url
			this.uploadUrlDescription = key

			this.uploadUrlPopoverShown = true
		},
	},

	created() {
		// Vue.config.debug = true

		window.onbeforeunload = () => {
			console.log('quiting...')

			this.saveState()
		}

		console.log('current', this.currentProject)
	},

	ready() {
		// set OS specific attributes (needed for CSS)
		document.body.setAttribute('platform', this.platform)

		document.win = remote.BrowserWindow.getFocusedWindow()

		// setup application menu
		if(this.platform == 'win32')
			this.mainMenu = createApplicationMenu(this)
		else
			createApplicationMenu(this)

		document.addEventListener('dragover', e => {
			e.preventDefault()
			return false
		}, false)

		document.addEventListener('drop', e => {
			e.preventDefault()
			return false
		}, false)

		// load state
		ipc.on('msg-bus', (event, msg) => {
			switch(msg.type) {
				case 'state-loaded':
					// console.log(msg.state)

					if(msg.state) {
						try {
							const state = JSON.parse(msg.state)
							console.log('parsed')
							this.loadState(state)
						} catch(e) {
							console.log(`Can't parse the state: ${e}`)
						}
					}

					// setup the panels dimensions
					this.$els.leftPanel.style.width = this.state.ui.leftPanelWidth + 'px'
					this.$els.centralPanel.style.width = this.state.ui.centralPanelWidth + 'px'
					this.$els.videoView.style.height = this.state.ui.videoViewHeight + 'px'

					console.log('making it visible')
					this.appIsReady = true // make the main container visible

					// check for updates
					if(this.state.ui.autoUpdates == 1) {
						setTimeout(() => {
							ipc.send('msg-bus', {
								type: 'check-for-update'
							})
						}, 5000)
					}

					// if the user opens an srt file directly
					if(remote.app.cmd_arg) {
						console.log(remote.app.cmd_arg)
						this.onSetSubFile([remote.app.cmd_arg])
						return
					}

					// now request subtitles if any
					if(!this.currentProject)
						return

					ipc.send('msg-bus', {
						type: 'load-subfile',
						subfileName: this.state.subfiles.current,
					})
					break

				case 'subfile-loaded':
					this.$nextTick(() => {
						this.loadSubfile(msg.subfile.items)
						this.$broadcast('splitter-resize') // adjust canvas size
					})
					break

				case 'window-active':
					if(msg.data)
						document.body.removeAttribute('inactive')
					else
						document.body.setAttribute('inactive', true)
					break

				case 'window-maximized':
					if(msg.data)
						document.body.removeAttribute('maximized')
					else
						document.body.setAttribute('maximized', true)
					break

				case 'open-with':
					console.log(msg.file_path)
					this.onSetSubFile([msg.file_path])
					break

				case 'subfile-exported':
					if(msg.error) {
						new Notification('Error', {
							body: msg.error,
							silent: true
						})
						return
					}

					if(!msg.silent) {
						new Notification('Subtitles exported', {
							body: msg.path,
							silent: true
						}).onclick = () => require('electron').shell.showItemInFolder(msg.path)
					}
					break

				case 'update-ready':
					this.updatePopupShown = true
					break
			}
		})
	},

	replace: false,
}
</script>

<template>
	<div class="main-container" style="display:none;" v-show="appIsReady">
		<div
			class="panel left-panel"
			v-el:left-panel
			v-dropzone="{callback: onSetSubFile, active: true}"
			>
			<header class="toolbar toolbar-header">
				<div class="toolbar-actions">
					<i-button v-if="platform == 'win32'" icon="menu" title="Application menu" v-dropdown="mainMenu"></i-button>
					<i-button v-if="platform == 'win32'" icon="cog" title="Preferences" @click="openModal"></i-button>
					<i-button class="btn-dark" icon="plus" @click="onSetSubFile" title="Open subtitles"></i-button>
				</div>
			</header>
			<project-list
				v-el:project-list
				:model="state.subfiles"
				:container-width="state.ui.leftPanelWidth"
				:sort-by="state.ui.projectSortOrder"
				@on-change="switchProject"
				@on-close="onCloseProject"
				@on-delete="onShowProjectDelete"
				@on-show-project-properties="onShowProjectProperties"
				@on-ost-url-ready="onShowOstUploaded"
				>
			</project-list>
		</div>

		<splitter @on-change="setLeftPanelWidth" class="left-panel-splitter"></splitter>

		<div class="central-panel" v-el:central-panel>
			<header class="toolbar toolbar-header">
				<div class="toolbar-actions">
					<sub-filter></sub-filter>
				</div>

			</header>

			<sub-list
				:model="currentProject"
				@on-delete="onDeleteTitle"
				@on-edit="openNewTitleModal('edit')"
				>
			</sub-list>
		</div>

		<splitter @on-change="setCentralPanelWidth"></splitter>

		<div class="right-panel">
			<header class="toolbar toolbar-header">
				<div class="toolbar-actions">

					<i-button
						icon="video"
						title="Load a video file"
						@click="onSetVideoFile"
						:disabled="!currentProject || !state.player.plugins_exist"
						>
					</i-button>

					<div class="btn-group">
						<i-button
							icon="left-open-big"
							title="Previous title"
							@click="$broadcast('move-title', 'prev')"
							:disabled="!currentProject"
							>
						</i-button>
						<i-button
							icon="right-open-big"
							title="Next title"
							@click="$broadcast('move-title', 'next')"
							:disabled="!currentProject"
							>
						</i-button>
					</div>

					<i-button
						icon="back-in-time"
						title="Shift titles"
						@click="openShiftModal"
						:disabled="!currentProject"
						>
					</i-button>

					<i-button
						icon="chart-line"
						title="Reindex titles"
						@click="onReindexSubfile"
						:disabled="!currentProject"
						>
					</i-button>

					<window-buttons v-if="platform == 'win32'"></window-buttons>
				</div>

			</header>

			<video-view
				v-el:video-view
				@canvas-ready="onCanvasReady"
				v-dropzone="{callback: onSetVideoFile, active: currentProject}"
				>
			</video-view>
			<splitter orientation="horizontal" @on-change="setVideoViewHeight"></splitter>
			<trans-input :model="currentProject"></trans-input>
		</div>

	</div>

	<preferences-modal
		v-if="preferencesModalShown"
		transition="modal"
		@close="preferencesModalShown = false"
		@ost-enabled=""
		>
	</preferences-modal>

	<shift-modal
		v-if="shiftModalShown"
		transition="modal"
		@on-close="shiftModalShown = false"
		>
	</shift-modal>

	<new-title-modal
		v-if="newTitleModalShown"
		transition="modal"
		:mode="newTitleMode"
		:capture-begin="captureBegin"
		:capture-finish="captureFinnish"
		@on-close="closeNewTitleModal"
		>
	</new-title-modal>

	<project-properties-popover
		v-if="projectProperiesShown"
		transition="popover"
		:initiator="projectProperiesInitiator"
		@on-close="projectProperiesShown = false"
		>
	</project-properties-popover>

	<project-delete-popover
		v-if="projectDeleteShown"
		transition="popover"
		:initiator="projectDeleteInitiator"
		:project="projectToDelete"
		@on-close="projectDeleteShown = false"
		>
	</project-delete-popover>

	<url-popover
		v-if="uploadUrlPopoverShown"
		transition="popover"
		@closed="uploadUrlPopoverShown = false"
		:initiator="uploadUrlPopoverInitiator"
		:description="uploadUrlDescription"
		:url="uploadedUrl"
		>
	</url-popover>

	<update-popup
		v-if="updatePopupShown"
		transition="central-popup"
		@closed="updatePopupShown = false"
		>
	</update-popup>
</template>
