const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap
const request = require('request');
const collect = require('collect.js');
const _ = require('lodash');
let data = require('../public/data.json');
// names.splice(_.indexOf(names, 'Included'), 1);
const humanNames = require('../public/humanNames.json');
_.each(data, (elem, ind) => {
	data[ind] = removeColumn(elem, ['Included', 'Inara Locations', 'System', 'USS Location']);
});
const names = Object.keys(data[0]);
function removeColumn(data, columnName) {
	return _.omit(data, columnName)
}

router.get('/', (req, res) => {
	res.status(418);
	res.render('Result', {
		title: 'EDSE',
		meta: 'I\'m a teapot.',
		result: []
	});
});
router.get('/:mat/:system?', async (req, res) => {
	let mats = req.params.mat.split(',');
	mats = _.uniq(mats);
	const vals = [];
	_.each(data, elem => {
		// delete elem.Included;
		_.each(mats, mat => {
			if (elem.Material === mat) {
				vals.push(elem);
			}
		});
	});
	const valsMapped = _.each(vals, (item, index, vals) => {
		const keysShip = item['Ship Type'].split(',');
		const keysUSS = item.Source.split(',');
		const usskeys = [];
		const shipkeys = [];
		_.each(keysShip, elem => {
			elem = elem.trim();
			try {
				if (!_.hasIn(humanNames['Ship Type'], vals[index]['Ship Type']) && _.findKey(humanNames['Ship Type'], elem)) {
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
		_.each(keysUSS, elem => {
			elem = elem.trim();
			try {
				if (!_.hasIn(humanNames.Source, vals[index].Source) && _.findKey(humanNames.Source, elem)) {
					const newVal = humanNames.Source[_.findKey(humanNames.Source, elem)][elem];
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
		vals[index].Source = usskeys.join(', ');
		vals[index]['Ship Type'] = shipkeys.join(', ');
	});
	const datas = [];
	datas[0] = names;
	if (!_.isEmpty(vals)) {
		datas[1] = valsMapped;
	}
	res.render('Result', {
		title: 'EDSE',
		result: datas,
		meta: `EDSE - ${mats.join(', ')}`
	});
});

module.exports = router;
