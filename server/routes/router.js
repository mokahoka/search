// defines routes for API

const express = require('express')
const router = express.Router()
const { cites } = require('./data.js');


// Utils function
const getCites = (query) => {

	const results = cites.filter((val) => {
		if( val.toLowerCase().indexOf(query) >= 0 ) return true
		return false;
	})
	return results;
}

// Routes
router.get("/", (req,res) => {
	res.send("Hello search bar world!");
});


// using query params for fetching query;
router.get("/api/:query", (req,res) => {
	const {query} = req.params;
	let results = getCites(query);
	if( results.length > 10) results = results.slice(0,10)
	res.json({results});
})

module.exports = router;