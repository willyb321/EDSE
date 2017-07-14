const express = require('express');

const router = express.Router();
const _ = require('lodash');
const data = require('../public/data.json');
const getIndexes = require('./getindexes');

const vals = getIndexes();
/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', {title: 'EDSE', data: vals, names: vals});
});

module.exports = router;
