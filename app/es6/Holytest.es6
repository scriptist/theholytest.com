'use strict';

var Vue = require('vue/dist/vue.js');
var Game = require('Game.es6');

module.exports = class Holytest {
	constructor(parent) {
		this.parent = parent;
		this.games = [];

		this.newGame();
	}

	newGame() {
		var game = new Game();
		this.currentGame = game;
		this.games.push(game);
	}
}
