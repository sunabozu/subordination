<script>
'use strict'

import Vue from 'vue'
import actions from '../store/actions'
import ListItem from './ListItem.vue'
import Popup from '../directives/Popup'


export default {
	components: {
		'list-item': ListItem
	},

	directives: {
		Popup,
	},

	data: () => {
		return {
			itemHeight: 85,
			virtualIndex: undefined,

			// before: 0,
			// after: 0,

			listHeight: 0,
			skip: 0,

			contextMenu: []
		}
	},

	props: {
		model: {
			// type: Object,
			required: true,
		},

		buffer: {
			default: 1,
		}
	},

	vuex: {
		actions: {
			makeItemActive: actions.subfiles.makeItemActive,
			copyOriginalSubitem: actions.subfiles.copyOriginalSubitem,

			setVideoTime: actions.player.setVideoTime,

			setScrollPosition: ({dispatch}, position) => { dispatch('SET_SCROLL_POSITION', position) },
		}
	},

	computed: {
		activeRange() {
			console.log(this.model.current_index, this.model.current_index - 1, this.model.current_index + 1)
			return {
				min: this.model.current_index - 1,
				max: this.model.current_index + 1,
			}
		},

		itemsFiltered() {
			if(!this.model)
				return []

			const result = []

			switch(this.model.filter) {
				case 'empty':
					this.model.items.forEach((value, index) => {
						if(value.text_trans === '')
							result.push({index, value})
					})
					break
				case 'all':
					this.model.items.forEach((value, index) => {
						result.push({index, value})

						// restore the previously saved position
						setTimeout(() => {
							console.log('scroll', this.model.scroll)
							this.$el.scrollTop = this.model.scroll != undefined ? this.model.scroll : 0
						}, 0)
					})
					break
				case 'ready':
					this.model.items.forEach((value, index) => {
						if(value.text_trans !== '')
							result.push({index, value})
					})
					break
			}

			this.checkHeight()
			return result
		},

		// new
		visibleItems() {
			return this.listHeight + this.buffer
		},

		visibleRange() {
			return [this.skip, this.visibleItems + this.skip]
		},

		beginHeight() {
			return this.skip * this.itemHeight
		},

		endHeight() {
			const result = (this.itemsFiltered.length - this.visibleItems - this.skip) * this.itemHeight
			return result >= 0 ? result : 0
		},
	},

	methods: {
		onScroll() {
			let skip = Math.round(this.$el.scrollTop / this.itemHeight) - this.buffer

			if(skip < 0) {
				this.skip = 0
				return
			}

			const diff = this.itemsFiltered.length - this.visibleItems

			if(skip > diff) {
				if(diff < 0)
					skip = 0
				else
					skip = this.itemsFiltered.length - this.visibleItems
			}

			this.skip = skip
		},

		// save position only when user scrolls or uses keyboard
		onWheel() {
			this.setScrollPosition(this.$el.scrollTop)
		},

		itemSelected(index) {
			this.virtualIndex = index

			if(this.model.current_index === index)
				return

			this.makeItemActive(index)


			if(this.model.video_path)
				this.setVideoTime(this.model.items[this.model.current_index].time_markers.start)
		},

		itemMoved(index, direction) {
			if(direction == 'prev' && index > 0) {
				this.makeItemActive(this.itemsFiltered[index - 1].index)
				this.virtualIndex = index - 1
			}
			if(direction == 'next' && index < this.itemsFiltered.length - 1) {
				this.makeItemActive(this.itemsFiltered[index + 1].index)
				this.virtualIndex = index + 1
			}

			if(this.model.video_path)
				this.setVideoTime(this.model.items[this.model.current_index].time_markers.start)
		},

		// double click on an item leads to copying the current
		// original text into the transinput
		onDoubleClick(index) {
			this.copyOriginalSubitem(index)
		},

		checkHeight() {
			this.listHeight = Math.round(this.$el.clientHeight / this.itemHeight)
		},
	},

	events: {
		'move-title': function(direction) {
			console.log(this.virtualIndex)
			if(this.virtualIndex == undefined)
				this.itemMoved(this.model.current_index, direction)
			else
				this.itemMoved(this.virtualIndex, direction)
		}
	},

	beforeCompile() {
		// prepare context menu
		this.contextMenu = [
			{
				label: 'Delete',
				accelerator: 'CmdOrCtrl+D',
				click: () => {
					this.$emit('on-delete')
				}
			},
			{
				label: 'Edit',
				accelerator: 'CmdOrCtrl+I',
				click: () => {
					this.$emit('on-edit')
				}
			}
		]
	},

	ready() {
		window.addEventListener('resize', this.checkHeight)
	}
}
</script>

<template>
	<ul class="list-group" tabindex="0" @scroll="onScroll" @mousewheel="onWheel | debounce 100" v-popup="contextMenu">
		<div v-el:begin :style="{height: beginHeight + 'px'}"></div>
		<template v-for="item in itemsFiltered">
			<list-item
				v-if="$index >= visibleRange[0] && $index <= visibleRange[1]"
				tabindex="-1"
				:active="item.index == model.current_index"
				:ready="item.value.text_trans != ''"
				@mousedown="itemSelected(item.index)"
				@dblclick="onDoubleClick(item.index)"
				@keydown.up="itemMoved($index, 'prev')"
				@keydown.down="itemMoved($index, 'next')"
				@keydown="onWheel"
				>
				<p class="list-item-indicator"></p>
				<div>
					<div class="list-item-header">
						<div class="light">{{item.value.time}}</div>
						<div class="light">#{{item.value.number}}</div>
					</div>
					<p>{{{item.value.text_orig | escape}}}</p>
				</div>
			</list-item>
		</template>

		<div v-el:end :style="{height: endHeight + 'px'}"></div>
	</ul>
</template>
