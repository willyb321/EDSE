const express = require('express');

const router = express.Router();
const _ = require('underscore');
const data = require('../public/data.json');

const names = Object.keys(data[0]);
const vals = [];
_.each(data, elem => {
	if (elem.Material && elem.Included !== '') {
		vals.push(elem.Material);
	}
});
/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', {title: 'EDSE', data: vals, names: vals.sort()});
});

module.exports = router;
