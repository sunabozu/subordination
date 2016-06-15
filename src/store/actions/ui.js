'use strict'

export default {
	setLeftPanelWidth({actions, dispatch, state}, width) {
		dispatch('SET_LEFT_PANEL_WIDTH', width)
	},

	setCentralPanelWidth({actions, dispatch, state}, width) {
		dispatch('SET_CENTRAL_PANEL_WIDTH', width)
	},

	setTransInputHeight({actions, dispatch, state}, height) {
		dispatch('SET_TRANS_INPUT_HEIGHT', height)
	},

	setProjectSortOrder({actions, dispatch, state}, projectSortOrder) {
		dispatch('SET_PROJECT_SORT_ORDER', projectSortOrder)
	},
}
