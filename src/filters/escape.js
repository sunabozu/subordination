'use strict'

import Vue from 'vue'

Vue.filter('escape', text => {
	if(!text)
		return text

	const entityMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'\"': '&quot;',
		'\'': '&#39;',
		'/': '&#x2F;'
	}

	for(let key in entityMap) {
		text = text.replace(new RegExp(key, 'g'), entityMap[key])
	}

	const font_re = /(&lt;font color=(?:&quot;){0,1}(#[\w]{6})(?:&quot;){0,1}.*&gt;.*&lt;&#x2F;font&gt;)/gim
	const i_re = /(&lt;i&gt;.*&lt;&#x2F;i&gt;)/gim
	const b_re = /(&lt;b&gt;.*&lt;&#x2F;b&gt;)/gim

	text = text.replace(font_re, '<font color="$2">$1</font>')
	text = text.replace(i_re, '<em>$1</em>')
	text = text.replace(b_re, '<b>$1</b>')
	text = text.replace(/\n/g, '<span class="light">↩</span><br/>')

	return text
})
