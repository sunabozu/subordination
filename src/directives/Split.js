'use strict'

export default {
	params: ['splitCallback'],

	bind() {
		this.splitters = []
		console.log('main container', this.el.children)

		// this.last = this.el.children[this.el.children.length - 1]

		const onStart = (e) => {
			document.body.style.cursor = this.cursor

			const cRect = this.el.getBoundingClientRect()
			const initDim = e.target.prevPane.getBoundingClientRect()[this.dim]
			let newDim = 0

			// calculate total size of all pens minus the last one (or the first one in case of vertical position)
			let totalDim = 0
			this.splitters.map((item) => {
				totalDim += item.prevPane.getBoundingClientRect()[this.dim]
			})

			const moveListener = (eMove) => {
				let diff = eMove[this.cursorDim] - e[this.cursorDim]

				if(this.opts.pos == 'vert')
					diff = 0 - diff

				newDim = initDim + diff

				if(newDim < this.opts.min[e.target.index]) {
					newDim = this.opts.min[e.target.index]
				}

				// the size of the stretched one
				const stretchedDim = cRect[this.dim] - (totalDim + diff)
				console.log(stretchedDim)
				if(stretchedDim < this.opts.min[this.opts.min.length - 1]) {
					console.log('limit')
					return
				}

				e.target.prevPane.style[this.dim] = newDim + 'px'

				// send signal with a slight delay
				setTimeout(() => {
					this.vm.$root.$broadcast('splitter-resize')
				}, 150)

			}

			const upListener = () => {
				// cleanup
				window.removeEventListener('mousemove', moveListener)
				window.removeEventListener('mouseup', upListener)

				// return default cursor
				document.body.style.cursor = 'auto'

				// notify about new size
				if(this.params.splitCallback)
					this.params.splitCallback(e.target.index, newDim)
			}

			window.addEventListener('mousemove', moveListener)
			window.addEventListener('mouseup', upListener)
		}

		for(let i = 1; i < this.el.children.length; i++) {
			const splitter = document.createElement('div')

			splitter.prevPane = this.el.children[i - 1]
			splitter.index = i - 1
			splitter.addEventListener('mousedown', onStart)
			this.splitters.push(splitter)

			this.el.children[i].insertBefore(splitter, null)
		}
	},

	update(opts) {
		console.log('update', opts.init)

		this.opts = opts

		this.cl = 'spl spl-h'
		this.dim = 'width'
		this.cursorDim = 'clientX'
		this.cursor = 'col-resize'

		if(this.opts.pos == 'vert') {
			this.cl = 'spl spl-v'
			this.dim = 'height'
			this.cursorDim = 'clientY'
			this.cursor = 'row-resize'
		}

		for(let i = 0; i < this.splitters.length; i++) {
			if(this.opts.pos == 'vert') {
				this.splitters[i].prevPane.style.width = '100%'
				this.splitters[i].prevPane = this.el.children[i + 1]
				console.log('SIBLING', this.splitters[i].prevPane)
			}

			this.splitters[i].setAttribute('class', this.cl)
			this.splitters[i].prevPane.style[this.dim] = opts.init[i] + 'px'
		}
	}
}
