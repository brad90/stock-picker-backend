var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");

var fetchProfile = (ticker) => {
	var profile = fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=dc59973da568cfab69e7000bd9200dd5`)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
		});
	return profile;
};

var fetchFinancials = (ticker) => {
	var financials = fetch(`https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=120&apikey=dc59973da568cfab69e7000bd9200dd5`);
	return financials;
};

var process = (json) => {
	var ticker = json.ticker;
	var response = {};
	var profile = fetchProfile(ticker);
	var financials = fetchFinancials(ticker);

	response.profile = profile;
	response.financials = financials;
	return response;
};

router.post("/companyinfo", function (req, res) {
	var json = req.body;
	var response = process(json);
	res.json(response);
});

module.exports = router;
