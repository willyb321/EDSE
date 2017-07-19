const _ = require('lodash');
const data = require('./public/data.json');
const fs = require('fs');

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
	fs.writeFileSync('public/indexes.json', JSON.stringify(vals), 'utf8');
}
getIndexes();
