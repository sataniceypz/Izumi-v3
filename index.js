const client = require('./lib/client')
require("./express.js");

const connect = async () => {
	try {
		await client.initialize()
	} catch (error) {
		console.error(error)
	}
}

connect()
