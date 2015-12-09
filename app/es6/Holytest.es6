'use strict';

var Vue = require('vue/dist/vue.js');
var Game = require('Game.es6');

module.exports = class Holytest {
	constructor(parent) {
		this.parent = parent;
		this.games = [];

		// Start game
		this.newGame();

		// Init Vue
		this.vue = new Vue({
			el: this.parent,
			data: this,
		});
	}

	newGame() {
		var game = new Game();
		this.currentGame = game;
		this.games.push(game);
	}
}
