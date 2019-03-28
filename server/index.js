// Express server for serving cites API

const express = require('express')
const app = express()
const port = 1337
const routers = require('./routes/router.js');
const cors = require('cors');

app.use(cors({
	origin:"*"
}))

app.use(routers);

app.listen(port, () => console.log(`Listening on port ${port}!`))