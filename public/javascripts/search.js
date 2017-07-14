const names = JSON.parse(document.getElementById('names').innerText);
const materials = [];
const indexes = [];
console.log(names);

_.each(names, (elem, ind) => {
	materials.push(elem.mat);
	indexes.push(elem.index);
});

$('#inp').select2({
	data: materials,
	placeholder: 'Enter as many mats as you want. (Up to 15)',
	maximumSelectionLength: 15
});

$('#submit').on('click', e => {
	const mats = _.uniq(e.target.form.children[0].value.split(','));
	mats.splice(0, 1);
	console.log(mats);
	_.each(mats, (elem, ind) => {
		mats[ind] = names[_.findKey(names, {mat: elem})].index;
	});
	const system = e.target.form.children[2].value;
	if (!_.isEmpty(mats)) {
		window.location.href = `${window.location}result/${mats}/${system}`;
	} else {
		swal('Enter at least 1 material', 'Up to 15', 'error')
		.catch(swal.noop);
	}
});
