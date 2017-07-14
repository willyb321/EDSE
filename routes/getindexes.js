const _ = require('lodash');
const data = require('../public/data.json');

function getIndexes() {
	const vals = [];
	let i = 0;
	_.each(data, (elem, index) => {
		if (elem.Material && elem.Included !== '') {
			vals[i] = {mat: elem.Material, index};
			i++;
		}
	});
	i = 0;
	return vals;
}
module.exports = getIndexes;
