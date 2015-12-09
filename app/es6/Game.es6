'use strict';

require('object-assign-shim/index.js');
var offlineData = require('offlineData.json');

module.exports = class Game {
	constructor() {
		this.lineCount = 10;
		this.listeners = {};

		this.on('ready', () => {
			console.log('Ready!', this.lines);
		});

		this.ready = false;
		this.getLines(lines => {
			this.ready = true;
			this.notify('ready');
		});
	}

	// Get lines from the API
	getLines(callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://api.theholytest.com/random/' + this.lineCount + '?t=' + new Date().getTime(), true);
		xhr.timeout = 5000;

		xhr.onload = () => {
			try {
				var responseJSON = JSON.parse(xhr.responseText);
				this.offline = false;
				this.lines = responseJSON.lines;
				callback();
			} catch(e) {
				this.getLinesOffline(callback);
			}
		};

		xhr.ontimeout = xhr.onerror = () => {
			this.getLinesOffline(callback);
		};

		xhr.send(null);
	}

	// Get lines locally (if API is down)
	getLinesOffline(callback) {
		this.offline = true;
		var lines = [];
		while (lines.length < this.lineCount) {
			var i = Math.floor(Math.random() * offlineData.length);
			lines.push(Object.assign({}, offlineData[i]));
		}

		this.lines = lines;

		callback();
	}

	// Bind a function to a named event
	on(event, f) {
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(f);
		return this;
	}

	// Call all functions bound to a named event
	notify(event, data) {
		if (!this.listeners[event])
			return;
		this.listeners[event].forEach(f => f(data));
		return this;
	}
}
