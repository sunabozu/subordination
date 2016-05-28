<script>
'use strict'

import Spinner from './Spinner.vue'

export default {
	components: {
		Spinner,
	},

	props: {
		wait: {},
	},

	computed: {

	},

	methods: {

	},

	ready() {

	},
}
</script>

<template>
	<button class="btn btn-mini btn-default btn-wait" :disabled="wait">
		<!-- <span v-show="wait" class="icon icon-cw"></span> -->
		<!-- <div></div> -->
		<spinner v-show="wait"></spinner>
		<slot></slot>
	</button>
</template>
