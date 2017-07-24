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
function distanceGet(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

router.get('/:refsys/:mat', (req, res, next) => {
	let refsys = req.params.refsys;
	let mat = req.params.mat;
	systemGet(mat, refsys)
	.then(result => {
		res.json(result);
	})
});

module.exports = router;
