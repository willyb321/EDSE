const express = require('express');

const router = express.Router();
const _ = require('lodash');
const data = require('../public/data.json');

const vals = [];
_.each(data, (elem, index) => {
	if (elem.Material && elem.Included !== '') {
		vals.push({mat: elem.Material, index: index});
	}
});
/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', {title: 'EDSE', data: vals, names: vals.sort()});
});

module.exports = router;
