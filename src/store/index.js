'use strict'

import Vue from 'vue'
import Vuex from 'vuex'

// import {commonActions} from './actions'

// import common from './mutations'
import common from './common_mutations'
import ui from './modules/ui'
import subfiles from './modules/subfiles'
// import {subfile, subfileMutations, subfileActions} from './modules/subfile'
import player from './modules/player'
import ost from './modules/ost'

import middlewares from './middlewares'


Vue.use(Vuex)

export default new Vuex.Store({
	strict: true,

	modules: {
		ost,
		ui,
		player,
		subfiles,
	},

	mutations: common,
	middlewares: [middlewares],
})
