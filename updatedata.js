const request = require('request');
const fs = require('fs');
const csv2json = require('csv2json');

request('https://docs.google.com/spreadsheets/d/1UhOvSzS8Z6CMtR09uIT6CHxusik1f__rDI0gsMiuWYI/export?format=csv')
	.pipe(csv2json())
	.pipe(fs.createWriteStream('public/data.json'));
