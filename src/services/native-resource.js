'use strict'

export default class Resource {
	baseUrl = null

	constructor(url) {
		this.baseUrl = url
	}

	queryString(params) {
		let result = ''
		Object.keys(params).forEach((key) => {
			result += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`
		})

		return result
	}

	get(params={}) {
		return new Promise((resolve, reject) => {
			if(!this.baseUrl)
				return reject('There is no URL')

			let body = this.queryString(params)

			const url = this.baseUrl + '?' + body
			body = null

			fetch(url, {
				body: body,
			})
			.then(
				resp => resp.json()
			)
			.then(
				data => resolve(data)
			)
			.catch(
				err => reject(err)
			)
		})
	}
}
