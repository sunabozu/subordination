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
			partialName: 'sub-list-item',
			itemHeight: 85,
			amount: 0,
			firstItem: 0,
			excess: 5,
			virtualIndex: undefined,

			// before: 0,
			// after: 0,

			contextMenu: []
		}
	},

	props: {
		model: {
			// type: Object,
			required: true,
		},
	},

	vuex: {
		actions: {
			makeItemActive: actions.subfiles.makeItemActive,
			copyOriginalSubitem: actions.subfiles.copyOriginalSubitem,

			setVideoTime: actions.player.setVideoTime,
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

			this.amount = Math.round(this.$el.clientHeight / this.itemHeight)
			const result = []

			switch(this.model.filter) {
				case 'empty':
					this.model.items.forEach((value, index) => {
						if(value.text_trans === '')
							result.push({index, value})
					})
					return result
				case 'all':
					this.model.items.forEach((value, index) => {
						result.push({index, value})
					})
					return result
				case 'ready':
					this.model.items.forEach((value, index) => {
						if(value.text_trans !== '')
							result.push({index, value})
					})
					return result
			}
		}
	},

	methods: {
		onScroll(event) {
			this.amount = Math.round(this.$el.clientHeight / this.itemHeight)

			this.firstItem = Math.round(event.target.scrollTop / this.itemHeight)
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
		}
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

	}
}
</script>

<template>
	<ul class="list-group" tabindex="0" @scroll="onScroll | debounce 18" v-popup="contextMenu">
		<!-- <div v-el:bef></div> -->
		<template v-for="item in itemsFiltered">
			<list-item
				v-if="($index >= firstItem - excess && $index <= firstItem + amount + excess) || ($index >= activeRange.min && $index <= activeRange.max)"
				tabindex="-1"
				:active="item.index == model.current_index"
				:ready="item.value.text_trans != ''"
				@mousedown="itemSelected(item.index)"
				@dblclick="onDoubleClick(item.index)"
				@keydown.up="itemMoved($index, 'prev')"
				@keydown.down="itemMoved($index, 'next')"
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
			<li
				v-else
				class="list-group-item"
				>
			</li>
		</template>

		<!-- <div v-el:aft></div> -->
	</ul>
</template>
