<script>
'use strict'

export default {
	props: {
		value: {
			type: Number,
			default: 0.93,
			coerce(value) {
				if(value > 1)
					return 1
				if(value < 0)
					return 0

				return value
			}
		},

		title: {
		},

		dimensions: {
			type: Number,
			default: 70
		},

		strokeWidth: {
			type: Number,
			default: 5
		}
	},

	computed: {
		radius() {
			console.log(this.dimensions, this.strokeWidth);
			return this.dimensions / 2 - this.strokeWidth
		},

		cf() {
			return 2 * Math.PI * this.radius
		},

		rotation() {
			return `rotate(-90 ${this.radius + this.strokeWidth} ${this.radius + this.strokeWidth})`
		},

		center() {
			console.log('center', this.radius, this.strokeWidth);
			return this.radius + this.strokeWidth
		},

		calculatedValue() {
			return this.value * this.cf
		},

		percent() {
			return this.value === 1 ? '✓': Math.floor(this.value * 100)
		}
	},

	methods: {

	},

	ready() {
		console.log('ok');
	},
}
</script>

<template>
	<svg class="graph" :style="{'width': dimensions,'min-width': dimensions, 'min-height': dimensions}">
		<g>
			<circle
				class="circle-graph"
				:stroke-width="strokeWidth"
				:r="radius"
				:cx="center"
				:cy="center"
				stroke-dasharray="0"
				>
			</circle>
			<circle
				class="circle-graph-top"
				:stroke-width="strokeWidth"
				:r="radius"
				:r="radius"
				:cx="center"
				:cy="center"
				stroke-dasharray="{{calculatedValue}} {{cf}}"
				:transform="rotation"
				>
			</circle>
			<text
				:x="center"
				:y="center"
				:font-size="radius"
				>
				{{percent}}
			</text>

			<title>{{title}}</title>
		</g>
	</svg>
</template>
