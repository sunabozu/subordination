import Vue from 'vue'
import * as types from '../mutation-types'


export default {
	state: {
		leftPanelWidth: 250,
		centralPanelWidth: 300,
		videoViewHeight: 400,

		projectSortOrder: 0, // 0 - by export name, 1 - by usage

		autoUpdates: 1,
	},

	// mutations
	mutations: {
		[types.SET_LEFT_PANEL_WIDTH](ui, width) {
			ui.leftPanelWidth = width
			console.log(width)
		},

		[types.SET_CENTRAL_PANEL_WIDTH](ui, width) {
			ui.centralPanelWidth = width
			console.log(width)
		},

		[types.SET_VIDEO_VIEW_HEIGHT](ui, height) {
			ui.videoViewHeight = height
			console.log(height)
		},

		[types.SET_PROJECT_SORT_ORDER](ui, projectSortOrder) {
			ui.projectSortOrder = projectSortOrder
		},

		[types.SET_AUTO_UPDATES](ui, autoUpdates) {
			console.log(autoUpdates)
			ui.autoUpdates = autoUpdates
		},
	}
}
