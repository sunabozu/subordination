'use strict'

/*
This solves the https://github.com/electron/electron/issues/3009 issue
Already fixed in https://github.com/electron/electron/pull/5557
TODO: update to the latest Electron version
*/

const remote = require('electron').remote


export default {
	methods: {
		setMovable() {
			this.win.setMovable(true)
		},

		setUnmovable() {
			this.win.setMovable(false)
		}
	},

	ready() {
		if(process.platform != 'darwin') // only needed in OS X
			return

		this.win = remote.getCurrentWindow()

		this.$el.addEventListener('mouseover', this.setUnmovable)
		this.$el.addEventListener('mouseout', this.setMovable)
	},

	beforeDestroy() {
		this.$el.removeEventListener('mouseover', this.setUnmovable)
		this.$el.removeEventListener('mouseout', this.setMovable)
	}
}
