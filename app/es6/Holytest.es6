'use strict';

var Vue = require('vue/dist/vue.js');
var Game = require('Game.es6');

Vue.filter('censor', function(str) {
	return str.replace(/koran|jinn/ig, str => new Array(str.length + 1).join('█'));
});

Vue.filter('uriComponent', function (str) {
  return encodeURIComponent(str);
})

module.exports = class Holytest {
	constructor(parent) {
		this.parent = parent;
		this.games = [];
		this.shareURL = window.location.protocol + '//' + window.location.host;

		// Start game
		this.newGame();

		// Init Vue
		this.vue = new Vue({
			el: this.parent,
			data: this,
			computed: {
				scoreURL: this.generateScoreURL,
				scoreURLTitle: this.generateScoreURLTitle,
			},
			methods: {
				newGame: this.newGame,
				openShareWindow: this.openShareWindow
			},
		});
	}

	generateScoreURL() {
		var score = this.currentGame.score;
		return window.location.protocol + '//' + window.location.host + '/score/' + score + '.html';
	}

	generateScoreURLTitle() {
		var score = this.currentGame.score;
		return 'I scored ' + score + '/10 on The Holy Test - how will you go?';
	}

	newGame() {
		var game = new Game();
		this.lastGame = this.currentGame;
		this.currentGame = game;
		this.games.push(game);
	}

	openShareWindow(e) {
		var elm = e.target;
		while (elm.parentElement && !elm.href) {
			elm = elm.parentElement;
		}
		if (!elm.href)
			return;

		window.open(elm.href, 'share', 'height=500,width=500');
	}
}
