<script>
'use strict'


export default {
	ready() {
		this.$el.focus()
	},
}
</script>

<template>
	<button class="btn btn-mini btn-primary"><slot></slot></button>
</template>
