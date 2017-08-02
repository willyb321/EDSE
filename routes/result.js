const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap
const axios = require('axios');
const _ = require('lodash');
const data = require('../public/data.json');
const getIndexes = require('../public/indexes.json');
const humanNames = require('../public/humanNames.json');

_.each(data, (elem, ind) => {
	data[ind] = removeColumn(elem, ['Included', 'Inara Locations', 'USS Location']);
});
const names = Object.keys(data[0]);

function removeColumn(data, columnNames) {
	return _.omit(data, columnNames);
}

process.on('unhandledRejection', err => {
	console.log(err.stack)
});

router.get('/', (req, res) => {
	res.status(418);
	res.render('Result', {
		title: 'EDSE',
		meta: 'I\'m a teapot.',
		result: []
	});
});

function distanceGet(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

function systemGet(mats, system) {
	return new Promise((resolve, reject) => {
		let toFind = [];
		let toPush = _.findKey(data, (elemtf) => {
			return elemtf.Material === mats;
		});
		toFind.push(toPush);
		let toRes = [];
		if (system === null || system === undefined) {
			resolve(['N/A', mats])
		}
		_.each(toFind, mat => {
			let params = {};
			if (data[mat]['System Allegiance']) {
				params.allegiancename = data[mat]['System Allegiance'];
			}
			if (data[mat]['System State']) {
				params.statename = data[mat]['System State'];
			}
			if (data[mat]['System Government'] && data[mat]['System Government'] === 'Anarchy') {
				params.securityname = 'Anarchy';
			}
			if (data[mat]['System Economy']) {
				params.primaryeconomyname = data[mat]['System Economy'];
			}
			console.log('Params: ' + JSON.stringify(params));
			let systemPos = [{}, {}];
			let allreqs = [axios.get(`http://guest:secret@elitebgs.kodeblox.com/api/eddb/v1/populatedsystems?name=${system}`)];
			if (!_.isEmpty(params)) {
				allreqs[1] = axios.get(`http://guest:secret@elitebgs.kodeblox.com/api/eddb/v1/populatedsystems`, {
					params: params
				})
			}
			axios.all(allreqs)
				.then(axios.spread((response, resdata) => {
					let distances = [];
					let distancesNum = [];
					if (response.data.length > 0) {
						if (!resdata) {
							resolve(['N/A', mat])
						} else {
							_.each(resdata.data, (elem, ind) => {
								distances.push({
									index: ind,
									name: elem.name,
									distance: distanceGet(parseInt(elem.x), parseInt(elem.y), parseInt(elem.z), parseInt(response.data[0].x), parseInt(response.data[0].y), parseInt(response.data[0].z))
								});
								distancesNum.push(distanceGet(parseInt(elem.x), parseInt(elem.y), parseInt(elem.z), parseInt(response.data[0].x), parseInt(response.data[0].y), parseInt(response.data[0].z)));
							});
							let minDis = _.min(distancesNum);
							const sysToUse = _.findIndex(distances, dis => {
								return dis.distance === minDis
							});
							if (resdata.data.length > 0) {
								console.log(response.data.length + ' datas');
								systemPos[0].x = resdata.data[sysToUse].x;
								systemPos[0].y = resdata.data[sysToUse].y;
								systemPos[0].z = resdata.data[sysToUse].z;
								systemPos[0].name = resdata.data[sysToUse].name;
							}
							if (response.data.length > 0) {
								systemPos[1].x = response.data[0].x;
								systemPos[1].y = response.data[0].y;
								systemPos[1].z = response.data[0].z;
								systemPos[1].name = response.data[0].name;
								toRes.push(response.data);
								toRes.push(mat);
								toRes.push(systemPos);
							}
						}
					} else {
						console.log('Nothing found, material was: ' + mat);
						toRes = ['N/A', toFind]
					}
					resolve(toRes);
				}));
		});
	})
}

function allSys(mats, system) {
	let allSystems = [];
	mats.forEach(elem => {
		allSystems.push(systemGet(elem, system));
	});
	return allSystems;
}

router.get('/:mat/:system?', async (req, res) => {
	let mats = req.params.mat.split(',');
	const matVals = getIndexes;
	_.each(mats, (elem, ind) => {
		elem = parseInt(elem);
		console.log(elem);
		mats[ind] = matVals[_.findIndex(matVals, e => {
			return e.index === elem
		})].mat;
	});
	mats = _.uniq(mats);
	const vals = [];
	_.each(data, elem => {
		_.each(mats, mat => {
			if (elem.Material === mat) {
				vals.push(elem);
			}
		});
	});
	const valsMapped = _.each(vals, (item, index, vals) => {
		const keysShip = item['Ship Type'].split(',');
		const keysUSS = item.Source.split(',');
		let popkeys = item['System Population'];
		const usskeys = [];
		const shipkeys = [];
		_.each(keysShip, elem => {
			elem = elem.trim();
			try {
				if (!_.hasIn(humanNames['Ship Type'], vals[index]['Ship Type']) && _.findKey(humanNames['Ship Type'], elem)) {
					const newVal = humanNames['Ship Type'][_.findKey(humanNames['Ship Type'], elem)][elem];
					shipkeys.push(newVal);
				} else {
					shipkeys.push(elem);
				}
			} catch (err) {
				console.log(err);
			}
		});
		switch (popkeys) {
			case 'Small':
				popkeys = humanNames.Population[_.findKey(humanNames.Population, 'Small')]['Small'];
				break;
			case 'Medium':
				popkeys = humanNames.Population[_.findKey(humanNames.Population, 'Medium')]['Medium'];
				break;
			case 'High':
				popkeys = humanNames.Population[_.findKey(humanNames.Population, 'High')]['High'];
				break;
			default:
				break;
		}
		item['System Population'] = popkeys;
		_.each(keysUSS, elem => {
			elem = elem.trim();
			try {
				if (!_.hasIn(humanNames.Source, vals[index].Source) && _.findKey(humanNames.Source, elem)) {
					const newVal = humanNames.Source[_.findKey(humanNames.Source, elem)][elem];
					usskeys.push(newVal);
				} else {
					usskeys.push(elem);
				}
			} catch (err) {
				console.log(err);
			}
		});
		item.Source = usskeys.join(', ');
		item['Ship Type'] = shipkeys.join(', ');
	});
	const datas = [];
	datas[0] = names;
	if (!_.isEmpty(vals)) {
		datas[1] = valsMapped;
	}
	res.render('Result', {
		title: 'EDSE',
		result: datas,
		refsys: req.params.system,
		meta: `EDSE - ${mats.join(', ')}`
	});
});

module.exports = router;
