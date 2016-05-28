'use strict'

import * as types from '../mutation-types'



export default {
	state: {
		username: '',
		password: '',

		ssl: false,

		verified: false,
	},

	// mutations
	mutations: {
		[types.SET_OST_CREDENTIALS](ost, {username, password}) {
			ost.username = username
			ost.password = password
		},

		[types.SET_OST_SSL](ost, enabled) {
			ost.ssl = enabled
		},

		[types.SET_OST_VERIFIED](ost, value) {
			ost.verified = value
		},
	}
}
