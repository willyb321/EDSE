const names = JSON.parse(document.getElementById('names').innerText);
$('#inp').select2({
	data: names,
	placeholder: 'Enter as many mats as you want. (Up to 15)',
	maximumSelectionLength: 15
});

$('#submit').on('click', e => {
	console.log(e);
	const mats = _.uniq(e.target.form.children[0].value.split(','));
	const system = e.target.form.children[2].value;
	window.location.href = `${window.location}result/${mats}/${system}`;
});
