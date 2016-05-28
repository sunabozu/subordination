'use strict'

import {remote} from 'electron'
import Vue from 'vue'


let OS = null // load dynamically
// let instance = null
let crypto = null // load dynamically

function getInstance({username, password}, ssl) {
	if(!OS)
		OS = require('opensubtitles-api')

	return  new OS({
		// useragent: 'FileBot v4.5.6',
		useragent: 'Subordination v' + remote.app.getVersion(),
		username: username,
		password: password,
		ssl,
	})
}

export default {
	verifyOstCredentials({state, dispatch}, credentials) {
		if(!crypto)
			crypto = require('crypto')

		credentials.password = crypto.createHash('md5').update(credentials.password).digest('hex')

		const promise = getInstance(credentials, state.ost.ssl).login()
		promise
			.then(resp => {
				console.log(resp)
				dispatch('SET_OST_CREDENTIALS', credentials)
				dispatch('SET_OST_VERIFIED', true)
			})
			.catch(err => {
				console.log('error', err)
				// dispatch('SET_OST_VERIFIED', false)
			})

		return promise
	},

	uploadToOst({state, dispatch}, {sub_path, video_path, lang, imdbid}) {
		console.log(video_path, sub_path)
		if(!state.ost.verified)
			return

		return getInstance({username: state.ost.username, password: state.ost.password})
			.upload({
				path: video_path,
				subpath: sub_path,
				sublanguageid: lang,
				imdbid,
			})

		// promise
		// 	.then(resp => {
		// 		if(resp.alreadyindb)
		// 			console.log(`IDSubtitle: ${resp.data.IDSubtitle}`)
		// 		console.log(`result: ${resp.status}, data: ${resp.data}`)
		// 	})
		// 	.catch(err => {
		// 		console.log(`error: ${err}`)
		// 	})

		// return promise
	},

	setOstSll({dispatch}, enabled) {
		dispatch('SET_OST_SSL', enabled)
	},

	getOstMetadata({state}, video_path) {
		if(!state.ost.verified)
			return

		return getInstance({username: state.ost.username, password: state.ost.password})
			.identify({path: video_path, extended: true})
	},
}
