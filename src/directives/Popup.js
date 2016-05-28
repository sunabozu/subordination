'use strict'

import Vue from 'vue'
import {remote} from 'electron'

const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');

export default {
	bind() {
		this.onRightClick = (e) => {
			setTimeout(() => {
				this.menu.popup(remote.getCurrentWindow())
			}, 50)

			// e.stopPropagation()
			// e.preventDefault()
		}

		this.el.addEventListener('contextmenu', this.onRightClick)
	},

	update(value) {
		if(!value)
			return

		this.menu = new Menu()
		for(let item of value) {
			this.menu.append(new MenuItem(item))
		}
	},

	unbind() {
		this.el.removeEventListener('contextmenu', this.onRightClick)
	}
}
