'use strict';


// Change URL if necessary
if (window.location.pathname !== '/') {
	var title = 'The Holy Test';
	document.title = title;
	if ('replaceState' in window.history)
		window.history.replaceState(null, title, '/');
}


if (document.readyState === 'complete') {
	init();
} else {
	document.addEventListener('DOMContentLoaded', init);
}

function init() {
	// Init test
	var Holytest = require('Holytest.es6');
	new Holytest(document.body);
}
