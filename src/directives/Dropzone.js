'use strict'

export default {
	bind() {
		this.el.classList.add('dropzone')

		this.initiate = e => {
			if(this.active)
				this.el.classList.add('dropzone-active')
		}

		this.end = e => {
			this.el.classList.remove('dropzone-active')
		}

		// console.log(this.el);
		this.el.addEventListener('drop', e => {
			if(!this.active)
				return false

			e.dataTransfer.items[0].webkitGetAsEntry().file(file => {
				this.callback([file.path])
				console.log(file.path)
			})
			
			this.end()
			return false
		}, false)

		this.el.addEventListener('dragenter', this.initiate)
		this.el.addEventListener('dragover', this.initiate)

		this.el.addEventListener('dragleave', this.end)

		this.el.addEventListener('dragend', this.end)

		this.el.addEventListener('dragexit', this.end)
	},

	update(params) {
		this.callback = params.callback
		this.active = params.active
		console.log(params)
	}
}
