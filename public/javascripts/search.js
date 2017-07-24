const names = JSON.parse(document.getElementById('names').innerText);
const materials = [];
const indexes = [];
console.log(names);

_.each(names, elem => {
	materials.push(elem.mat);
	indexes.push(elem.index);
});

const inpSel2 = $('#inp').select2({
	data: materials,
	placeholder: 'Enter as many mats as you want. (Up to 15)',
	maximumSelectionLength: 15
});

window.onload = () => {
	if (window.location.href.search(/\?importURL=true/) !== -1 && localStorage.getItem('toImport')) {
		importURL(null);
	}
}

function askForURL() {
	swal({
		title: 'Input URL',
		input: 'text',
		showCancelButton: true
	}).then(result => {
		importURL(result);
	})
}

function importURL(url) {
	let found = localStorage.getItem(`url_${url}`)
	if (url === null) {
		found = localStorage.getItem('toImport');
		localStorage.removeItem('toImport');
	}
	if (found) {
		found = JSON.parse(found);
		if (typeof found.mats === 'string') {
			found.mats = found.mats.split(',');
		}
	} else {
		return null;
	}
	console.log(found.mats)
	_.each(found.mats, (elem, ind) => {
		console.log(elem)
		found.mats[ind] = names[_.findKey(names, {
			mat: elem
		})].mat;
	})
	inpSel2.val(found.mats).trigger('change');
	$('#sys').val(found.system);
	return
}

$('#submit').on('click', e => {
	let mats = _.uniq(e.target.form.children[0].value.split(','));
	if (mats[0] === '') {
		mats.splice(0, 1);
	}
	const system = e.target.form.children[2].value;
	console.log(mats);
	let matstemp = mats;
	_.each(mats, (elem, ind) => {
		mats[ind] = names[_.findKey(names, {
			mat: elem
		})].index;
	});
	mats = mats.sort();
	localStorage.setItem(`url_${window.location}result/${mats}/${system}`, JSON.stringify({
		mats: matstemp.sort().join(','),
		system: system
	}));
	if (!_.isEmpty(mats)) {
		window.location.href = `${window.location.href.replace('?importURL=true', '')}result/${mats}/${system}`;
	} else {
		swal('Enter at least 1 material', 'Up to 15', 'error')
			.catch(swal.noop);
	}
});
