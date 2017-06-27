const express = require('express');
const router = express.Router();
const request = require('request');
const collect = require('collect.js');
const _ = require('underscore');
const data = require('../public/data.json');
let names = Object.keys(data[0]);

const humanNames = {
		"Ship Type": [
			{TR: "Transport"},
			{CO: "Combat"},
			{MA: "Military and Authority"}
		],
		"USS Type": [
			{AN: "Anomaly"},
			{CA: "Combat Aftermath"},
			{CDP: "Convoy Dispersal Pattern"},
			{DE: "Degraded Emissions"},
			{EE: "Encoded Emissions"},
			{HGE: "High Grade Emissions"}
		]
}

router.get('/:mat/:system?', async function(req, res, next) {
	let mats = req.params.mat.split(',');
	let vals = [];
	_.each(data, (elem, ind) => {
		_.each(mats, mat => {
			if (elem.Material === mat) {
				vals.push(elem)
			}
		})
	});
	const collection = collect(vals);
	const valsMapped = _.each(vals, (item, index, vals) => {
		let keysShip = item["Ship Type"].split(',');
		let keysUSS = item["USS Type"].split(',')
		// console.log(keysShip);
		// console.log(keysUSS);
		let usskeys = [];
		_.each(keysUSS, (elem, ind) => {
			elem = elem.trim()
			try {
				if (!_.contains(humanNames["USS Type"], vals[index]["USS Type"])) {
					const newVal = humanNames["USS Type"][_.findKey(humanNames["USS Type"], elem)][elem]
					usskeys.push(newVal);
					console.log("USS newVal: " + newVal)
				}
			} catch (err) {
				console.log(err);
			}
		});
		vals[index]["USS Type"] = usskeys.join(', ')
	})
	let datas = [];
	datas[0] = names;
	if (!_.isEmpty(vals)) {
		datas[1] = valsMapped;
	}
	// request(`http://elitebgs.kodeblox.com/api/populatedsystems/name/${req.params.system}/statename/`, (error, response, body) => {
		// console.log('error:', error); // Print the error if one occurred
		// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		// console.log('body:', body);
		// body = JSON.parse(body);
	// });
	res.render('Result', { title: 'EDSE', result: datas});
});

module.exports = router;
