const names = JSON.parse(document.getElementById('names').innerText);
$('#inp').select2({
	data: names,
	placeholder: 'Enter as many mats as you want. (Up to 15)',
	maximumSelectionLength: 15
});

$('#submit').on('click', e => {
	const mats = _.uniq(e.target.form.children[0].value.split(','));
	mats.splice(0, 1);
	const system = e.target.form.children[2].value;
	if (!_.isEmpty(mats)) {
		window.location.href = `${window.location}result/${mats}/${system}`;
	} else {
		swal('Enter at least 1 material', 'Up to 15', 'error')
		.catch(swal.noop);
	}
});
