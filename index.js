const client = require('./lib/client')
const port = process.env.PORT || 8000;

const connect = async () => {
	try {
		await client.initialize()
	} catch (error) {
		console.error(error)
	}
}

connect()
