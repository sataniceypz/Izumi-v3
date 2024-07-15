const client = require('./lib/client')

const connect = async () => {
	try {
		await client.initialize()
	} catch (error) {
		console.error(error)
	}
}

connect()
