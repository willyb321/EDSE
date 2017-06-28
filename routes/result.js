const express = require('express');

const router = express.Router();
const request = require('request');
const collect = require('collect.js');
const _ = require('underscore');
const data = require('../public/data.json');

const names = Object.keys(data[0]);

const humanNames = {
	'Ship Type': [
			{TR: 'Transport'},
			{CO: 'Combat'},
			{MA: 'Military and Authority'}
	],
	'USS Type': [
			{AN: 'Anomaly'},
			{CA: 'Combat Aftermath'},
			{CDP: 'Convoy Dispersal Pattern'},
			{DE: 'Degraded Emissions'},
			{EE: 'Encoded Emissions'},
			{HGE: 'High Grade Emissions'}
	]
};

router.get('/:mat/:system?', async (req, res, next) => {
	const mats = req.params.mat.split(',');
	mats.splice(0, 1);
	const vals = [];
	_.each(data, (elem, ind) => {
		_.each(mats, mat => {
			if (elem.Material === mat) {
				vals.push(elem);
			}
		});
	});
	const valsMapped = _.each(vals, (item, index, vals) => {
		const keysShip = item['Ship Type'].split(',');
		const keysUSS = item['USS Type'].split(',');
		const usskeys = [];
		const shipkeys = [];
		_.each(keysShip, (elem, ind) => {
			elem = elem.trim();
			try {
				if (!_.contains(humanNames['Ship Type'], vals[index]['Ship Type']) && _.findKey(humanNames['Ship Type'], elem)) {
					const newVal = humanNames['Ship Type'][_.findKey(humanNames['Ship Type'], elem)][elem];
					shipkeys.push(newVal);
					console.log('Ship newVal: ' + newVal);
				} else {
					const newVal = elem;
					shipkeys.push(newVal);
					console.log('Ship newVal: ' + newVal);
				}
			} catch (err) {
				console.log(err);
			}
		});
		_.each(keysUSS, (elem, ind) => {
			elem = elem.trim();
			try {
				if (!_.contains(humanNames['USS Type'], vals[index]['USS Type']) && _.findKey(humanNames['USS Type'], elem)) {
					const newVal = humanNames['USS Type'][_.findKey(humanNames['USS Type'], elem)][elem];
					usskeys.push(newVal);
					console.log('USS newVal: ' + newVal);
				} else {
					const newVal = elem;
					usskeys.push(newVal);
					console.log('USS newVal: ' + newVal);
				}
			} catch (err) {
				console.log(err);
			}
		});
		vals[index]['USS Type'] = usskeys.join(', ');
		vals[index]['Ship Type'] = shipkeys.join(', ');
	});
	const datas = [];
	datas[0] = names;
	if (!_.isEmpty(vals)) {
		datas[1] = valsMapped;
	}
	res.render('Result', {title: 'EDSE', result: datas, meta: `EDSE - ${mats.join(', ')}`});
});

module.exports = router;
