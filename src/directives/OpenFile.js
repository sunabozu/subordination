'use strict'

import Vue from 'vue'

export default {
	params: ['clientSize'],

	bind: function() {
		this.el.style.overflow = 'hidden'

		let clientWidth = this.el.clientWidth
		let clientHeight = this.el.clientHeight

		if(this.params.clientSize) {
			clientWidth = this.params.clientSize[0]
			clientHeight = this.params.clientSize[1]
		}
		
		this.el.innerHTML += `<input type="file"
			style="
				position: absolute !important;
				top: 0;
				left: 0;
				overflow: hidden !important;
				padding:0;
				opacity:0;
				width:${clientWidth}px !important;
				height:${clientHeight}px !important;
				"
			/>`

		const file_input = this.el.childNodes[this.el.childNodes.length - 1]

		file_input.addEventListener('change', (event) => {
			console.log(this.el, this.el.clientWidth);
			if(typeof this.callback === 'function')
				this.callback(event.target.files);
		});
	},

	update: function(callback) {
		this.callback = callback
		console.log(this.el, this.el.clientWidth);
	}
}
