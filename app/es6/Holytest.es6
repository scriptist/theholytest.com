'use strict';

var Vue = require('vue/dist/vue.js');
var Game = require('Game.es6');

Vue.filter('censor', function(str) {
	return str.replace(/koran|jinn/ig, str => new Array(str.length + 1).join('█'));
});

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
			methods: {
				newGame: this.newGame
			},
		});
	}

	newGame() {
		var game = new Game();
		this.lastGame = this.currentGame;
		this.currentGame = game;
		this.games.push(game);
	}
}
