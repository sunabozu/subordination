// debounces events
export default function debounce(callback, wait=0) {
	let timeout = 0

	return (...args) => {
		if(timeout === 0) {
			timeout = setTimeout(() => {
				callback(...args)
				timeout = 0
			}, wait)
		}
	}
}
