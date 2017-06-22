const names = ["Proto Radiolic Alloys", "Conductive Ceramics", "Proto Light Alloys"];
const states = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.whitespace,
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// `states` is an array of state names defined in "The Basics"
	local: names
});

$('#bloodhound .typeahead').typeahead({
		hint: true,
		highlight: true,
		debug: true
	},
	{
		name: 'stuff',
		source: states
	});
$('#inp').on('keypress', e => {
	console.log(e)
	if (e.keyCode === 13) {
		window.location.href = `${window.location}result/${e.target.value}`
	}
});
