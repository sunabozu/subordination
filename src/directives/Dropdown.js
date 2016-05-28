'use strict'

import Vue from 'vue'
import {remote} from 'electron'


export default {
	bind: function() {
		// console.log(this.el);
		this.el.addEventListener('click', (event) => {
			event.preventDefault()

			const elRect = this.el.getBoundingClientRect()
			const margin_top = process.platform == 'darwin' ? 4 : 0

			this.menu.popup(remote.getCurrentWindow(),
				Math.round(elRect.left),
				Math.round(elRect.top) + elRect.height + margin_top //not sure why I must add 4
			)
		})
	},

	update: function(menu) {
		this.menu = menu
		// console.log(menu);
	}
}
