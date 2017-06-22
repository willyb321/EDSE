const express = require('express');
const router = express.Router();
const request = require('request');
const _ = require('underscore');
const data = require('../public/data.json');
let names = Object.keys(data[0]);

router.get('/:mat/:system?', function(req, res, next) {
	// request(`http://elitebgs.kodeblox.com/api/populatedsystems/name/${req.params.system}/statename/`, (error, response, body) => {
		// console.log('error:', error); // Print the error if one occurred
		// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		// console.log('body:', body);
		// body = JSON.parse(body);
	// });
	let mats = req.params.mat.split(',');
	let vals = [];
	_.each(data, (elem, ind) => {
		_.each(mats, mat => {
			if (elem.Material === mat) {
				vals.push(elem)
			}
		})
	});
	let datas = [];
	datas[0] = names;
	if (!_.isEmpty(vals)) {
		datas[1] = vals;
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
