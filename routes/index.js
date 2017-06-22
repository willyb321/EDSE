var express = require('express');
var router = express.Router();
const _ = require('underscore');
const data = require('../public/data.json');
let names = Object.keys(data[0]);
let vals = [];
_.each(data, elem => {
	if (elem.Material && elem.Included !== "") {
		vals.push(elem.Material)
	}
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'EDSE', data: vals, names: vals.sort() });
});

module.exports = router;
