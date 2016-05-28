<script>
'use strict'

import actions from '../store/actions'
import Modal from './Modal.vue'
import TimeInput from './TimeInput.vue'
import {ms2string} from '../utils/time'
import aButton from './aButton.vue'


export default {
	components: {
		Modal,
		TimeInput,
		aButton,
	},

	data() {
		return {
			newTitle: {
				number: 0,
				text_orig: '',
				text_trans: '',
				time: '',
				time_markers: {
					start: 0,
					end: 0
				}
			},

			index: 0,
			// duration: undefined,
			bindTime: true,
			reindex: true,

			title: {},
		}
	},

	props: {
		mode: { // mode: after_current, end, edit, time_marks
			default: 'after_current'
		},

		captureBegin: {},
		captureFinish: {},
	},

	vuex: {
		getters: {
			currentProject(state) {
				return state.subfiles.projects[state.subfiles.current]
			},
		},

		actions: {
			reindexSubfile: actions.subfiles.reindexSubfile,
			updateSubtitleFull: actions.subfiles.updateSubtitleFull,

			insertSubtitle({dispatch}, subtitle, index) {
				dispatch('INSERT_SUBTITLE', subtitle, index)
				dispatch('MAKE_SUBTITLE_ACTIVE', index)

				if(this.reindex) {
					setTimeout(() => {
						this.reindexSubfile(index)
					}, 10)
				}
			}
		}
	},

	computed: {
		currentTitle() {
			if(this.currentProject)
				return this.currentProject.items[this.currentProject.current_index]
		},

		lastTitle() {
			if(this.currentProject && this.currentProject.items.length > 0)
				return this.currentProject.items[this.currentProject.items.length - 1]
		},

		calculateDuration() {
			return this.newTitle.time_markers.end - this.newTitle.time_markers.start
		},

		titleValid() {
			if(this.newTitle.text_orig != '' && // empty title
				this.calculateDuration > 0) { // zero or negative duration
				return true
			}
		},

		addLabel() {
			return this.mode == 'edit' ? 'Edit' : 'Add'
		}
	},

	watch: {
		'newTitle.time_markers.start': function(newVal, oldVal) {
			if(this.bindTime && oldVal) {
				const diff = newVal - oldVal
				console.log(diff, newVal, oldVal, this.newTitle.time_markers.end)
				this.newTitle.time_markers.end += diff
			}
		}
	},

	methods: {
		onDurationChanged(e) {
			this.ends = this.begins + parseInt(e.target.value)
		},

		onAdd() {
			this.newTitle.time = ms2string(this.newTitle.time_markers.start, this.newTitle.time_markers.end)
			this.$dispatch('on-close')

			setTimeout(() => {
				if(this.mode == 'edit') {
					this.updateSubtitleFull(this.currentProject.current_index, this.newTitle)
				} else {
					this.insertSubtitle(this.newTitle, this.index)
				}
			}, 250)
		},

		onClose() {
			this.$dispatch('on-close')
		}
	},

	ready() {
		switch(this.mode) {
			case 'after_current':
				this.newTitle.number = this.currentTitle.number + 1
				this.newTitle.time_markers.start = this.currentTitle.time_markers.end
				this.newTitle.time_markers.end = this.newTitle.time_markers.start + 2000 // plus 2s
				this.index = this.currentProject.current_index + 1
				break

			case 'end':
				if(this.lastTitle) {
					this.newTitle.number = this.lastTitle.number + 1
					this.newTitle.time_markers.start = this.lastTitle.time_markers.end
					this.newTitle.time_markers.end = this.lastTitle.time_markers.end + 2000 // plus 2s
					this.index = this.currentProject.items.length
				} else { // if list is empty
					this.newTitle.number = 1
					this.newTitle.time_markers.start = 0
					this.newTitle.time_markers.end = 2000 // plus 2s
					this.index = 0
				}
				break

			case 'edit':
				this.newTitle.number = this.currentTitle.number
				this.newTitle.time_markers.start = this.currentTitle.time_markers.start
				this.newTitle.time_markers.end = this.currentTitle.time_markers.end
				this.newTitle.text_orig = this.currentTitle.text_orig
				this.newTitle.text_trans = this.currentTitle.text_trans
				break

			case 'time_marks':
				this.newTitle.number = this.currentTitle.number + 1
				this.newTitle.time_markers.start = this.captureBegin
				this.newTitle.time_markers.end = this.captureFinish
				this.index = this.currentProject.current_index + 1
				break
		}

		this.$els.text_orig.focus()
	},
}
</script>

<template>
	<div>
		<modal>
			<div class="form-group">
				<label>Number:</label>
				<input type="number" class="form-control" style="max-width: 60px;" v-model="newTitle.number">
			</div>

			<div class="form-group">
				<label>Begins:</label>
				<time-input :model.sync="newTitle.time_markers.start"></time-input>
			</div>

			<div class="form-group">
				<label>Ends:</label>
				<time-input :model.sync="newTitle.time_markers.end"></time-input>
			</div>

			<div class="form-group">
				<label>Duration (ms):</label>
				<input type="number" class="form-control" style="max-width: 60px;" min="0" step="100" v-model="calculateDuration" :disabled="bindTime" @change="onDurationChanged">
			</div>

			<div class="form-group">
				<label>Preserve duration (one way):</label>
				<input type="checkbox" v-model="bindTime">
			</div>

			<div class="form-group">
				<label>Reindex the following entries:</label>
				<input type="checkbox" v-model="reindex">
			</div>

			<div class="form-group">
				<textarea class="form-control" style="flex-grow: 1; margin-left: 0;" v-model="newTitle.text_orig" v-el:text_orig></textarea>
			</div>

			<div class="form-footer">
				<button class="btn btn-mini btn-default" @click="onClose">
					Cancel
				</button>
				<a-button @click="onAdd" :disabled="!titleValid">
					{{addLabel}}
				</a-button>
			</div>
		</modal>
	</div>
</template>
