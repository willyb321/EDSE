const refsys = document.getElementById('refsys').innerText;
const allSystems = document.getElementsByClassName('itemSystem');
let mats = [];
function distanceGet(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

function getSysNDis(refsys, mat, elem) {
	return new Promise((resolve, reject) => {
	$.ajax({
			url: `/getsystems/${refsys}/${mat}`
		})
		.then(resdata => {
			if (resdata[0] !== 'N/A' && resdata[2]) {
				let distance = distanceGet(parseInt(resdata[2][0].x), parseInt(resdata[2][0].y), parseInt(resdata[2][0].z), parseInt(resdata[2][1].x), parseInt(resdata[2][1].y), parseInt(resdata[2][1].z)).toFixed(2);
				elem.innerText = `${resdata[2][0].name} (${distance}ly away from ${resdata[2][1].name})`;
			} else {
				elem.innerText = 'N/A';
			}
			resolve();
		})
	})
}

function editURL() {
	const parsedURL = document.createElement('a');
	parsedURL.href = window.location.href;
	window.location.href = `${parsedURL.protocol}//${parsedURL.host}?importURL=true`
}

window.onload = () => {
	_.each(allSystems, elem => {
			mats.push(elem.parentElement.children[0].innerText);
	});
	localStorage.setItem('toImport', JSON.stringify({url: window.location.href, mats: mats.join(','), system: refsys}));
	localStorage.setItem(`url_${window.location.href}`, JSON.stringify({mats: mats.join(','), system: refsys}));
	if (refsys.trim() !== '') {
		allSysNDis();
	}
};
let allSysPromises = [];
function allSysNDis() {
	if (refsys) {
		_.each(allSystems, elem => {
			elem.innerText = 'Loading...';
			allSysPromises.push(getSysNDis(refsys, elem.parentElement.children[0].innerText, elem));
		});
		Promise.all(allSysPromises).then(() => {
			console.log('Loaded systems');
		})
	}
}
