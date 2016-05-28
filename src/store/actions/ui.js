'use strict'

export default {
	setLeftPanelWidth({actions, dispatch, state}, width) {
		dispatch('SET_LEFT_PANEL_WIDTH', width)
	},

	setCentralPanelWidth({actions, dispatch, state}, width) {
		dispatch('SET_CENTRAL_PANEL_WIDTH', width)
	},

	setVideoViewHeight({actions, dispatch, state}, height) {
		dispatch('SET_VIDEO_VIEW_HEIGHT', height)
	},

	setProjectSortOrder({actions, dispatch, state}, projectSortOrder) {
		dispatch('SET_PROJECT_SORT_ORDER', projectSortOrder)
	},
}
