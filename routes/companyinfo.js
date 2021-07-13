const { response } = require("express");
var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");

async function process(json) {
	var ticker = json.ticker;
	responseJson = {
		profile: {},
		financials: {},
	};

	// ** PROFILE **
	try {
		let data = await fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=dc59973da568cfab69e7000bd9200dd5`);
		let json = await data.json();
		responseJson.profile.symbol = json[0].symbol;
		responseJson.profile.companyName = json[0].companyName;
		responseJson.profile.exchange = json[0].exchangeShortName;
		responseJson.profile.sector = json[0].sector;
		responseJson.profile.image = json[0].image;
	} catch (err) {
		console.log(err);
	}

	// ** FINANCIALS **
	try {
		let data = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=120&apikey=dc59973da568cfab69e7000bd9200dd5`);
		let json = await data.json();
		responseJson.financials.profitMargin = json[0].netincome / json[0].revenue;
		responseJson.financials.operatingCashFlow = [];
		json.forEach((x) => {
			responseJson.financials.operatingCashFlow.push(x.operatingIncome);
		});
	} catch (err) {
		console.log(err);
	}

	// ** GROWTH **
	try {
		let data = await fetch(`https://financialmodelingprep.com/api/v3/financial-growth/${ticker}?limit=20&apikey=dc59973da568cfab69e7000bd9200dd5`);
		let json = await data.json();
		responseJson.financials.revenueGrowth = [];
		json.forEach((x) => {
			responseJson.financials.revenueGrowth.push(x.revenueGrowth);
		});
	} catch (err) {
		console.log(err);
	}

	// ** BALANCE SHEET **
	try {
		let data = await fetch(`https://financialmodelingprep.com/api/v3/balance-sheet-statement-as-reported/${ticker}?limit=10&apikey=dc59973da568cfab69e7000bd9200dd5`);
		let json = await data.json();
		responseJson.financials.assests = [];
		responseJson.financials.liabilities = [];
		json.forEach((x) => {
			responseJson.financials.assests.push(x.assets);
			responseJson.financials.liabilities.push(x.liabilities);
		});
	} catch (err) {
		console.log(err);
	}

	// ** CASHFLOW **
	try {
		let data = await fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${ticker}?apikey=dc59973da568cfab69e7000bd9200dd5`);
		let json = await data.json();
		responseJson.financials.cashflow = [];
		responseJson.financials.operatingCashflow = [];

		json.forEach((x) => {
			responseJson.financials.cashflow.push(x.freeCashFlow);
			responseJson.financials.operatingCashflow.push(x.operatingCashFlow);
		});
	} catch (err) {
		console.log(err);
	}

	// ** RATIOS **
	try {
		let data = await fetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${ticker}?apikey=dc59973da568cfab69e7000bd9200dd5`);
		let json = await data.json();
		responseJson.financials.pe = json[0].peRatioTTM;
	} catch (err) {
		console.log(err);
	}

	//

	https: return responseJson;
}

router.post("/companyinfo", function (req, res) {
	var json = req.body;
	var responseJson = null;

	process(json).then((x) => {
		responseJson = x;
		console.log("meh", responseJson);
		res.json(responseJson);
	});
});

module.exports = router;
