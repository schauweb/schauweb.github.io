"use strict";

var moves = 0;
var selectedPenguin = null;

function gameInit(state) {
	moves = state.moves;
	loadPenguins(state.penguins);
    scene = SCENE_GAME;
}

function gameUpdate() {
	var animating = 0;
	for (var i = 0; i < PENGUINS; i++) {
		var penguin = penguins[i];
		animating += penguin.animating() ? 1 : 0;
		penguin.animate();
	}

	if (animating > 0) {
		return;
	}

	if (isGameOver()) {
		showGameOver();
	}
}

function clickDown(position) {
	selectedPenguin = null;
	var dX = parseInt(position.x / displayScale);
	var dY = parseInt(position.y / displayScale);
	if (dX < PENGUIN_X ||
		dX >= (PLAYFIELD_W + PENGUIN_X) ||
		dY < PENGUIN_Y ||
		dY >= (PENGUIN_Y + PENGUIN_H))  {
		return;
	}

	for (var i = 0; i < PENGUINS; i++) {
		if (penguins[i].animating()) {
			return;
		}
	}

	var x = dX - PENGUIN_X;
	var pieces = getPieces();
	var index = parseInt(x / PENGUIN_W);
	if (pieces[index] === ' ') {
		return;
	}

	var penguin = findPenguin(index);
	if (penguin === null) {
		return;
	}

	selectedPenguin = penguin;
	var hole = findHole(pieces);
	var distance = Math.abs(hole - index);
	if (distance == 1) {
		penguin.walk(hole - index);
		moves++;
		saveState();
	} else if (distance == 2) {
		var jumpingPenguin = findPenguin((hole + index) / 2);
		if (jumpingPenguin === null) {
			return;
		}
		jumpingPenguin.jump();
		penguin.slide((hole - index) / 2);
		moves++;
		saveState();
	} else {
		penguin.yuck();
	}
}

function findPenguin(index) {
	for (var i = 0; i < PENGUINS; i++) {
		var p = penguins[i];
		var pI = parseInt(p.x / PENGUIN_W);
		if (pI == index) {
			return p;
		}
	}

	return null;
}

function getPieces() {
	var map = []
	for (var i = 0; i < PIECES; i++) {
		map[i] = ' ';
	}

	for (var i = 0; i < PENGUINS; i++) {
		var penguin = penguins[i];
		var index = parseInt(penguin.x / PENGUIN_W);
		map[index] = penguin.type;
	}

	return map;
}

function findHole(pieces) {
	var i = 0;
	for (; (i < PIECES) && (pieces[i] !== ' '); i++);
	return i;
}

function clickUp(position) {
	if (selectedPenguin === null) {
		return;
	}

	if (selectedPenguin.isYuckking()) {
		selectedPenguin.resetFrame();
		return;
	}

	selectedPenguin = null;
}

function mouseMove(position) {
	clickUp(position);
}

function saveState() {
	var map = []
	for (var i = 0; i < PIECES; i++) {
		map[i] = ' ';
	}

	for (var i = 0; i < PENGUINS; i++) {
		var penguin = penguins[i];
		var index = parseInt(penguin.x / PENGUIN_W);
		if (penguin.type == 'g') {
			map[index] = penguin.facing == -1 ? 'G' : 'g';
		} else {
			map[index] = penguin.facing == -1 ? 'r' : 'R';
		}
	}

	var p = '';
	for (var i = 0; i < PIECES; i++) {
		p += map[i];
	}

	stateManager.save(moves, p);
}

function isGameOver() {
	var map = getPieces();
	for (var i = 0; i < 5; i++) {
		if (map[i] != 'r' || map[i + 6] != 'g') {
			return false;
		}
	}

	return true;
}

function showGameOver() {
	penguinRollerSetup();
	document.getElementById('game-over-close').onclick = function(event) {
		event.preventDefault();
		document.getElementById("game-over").style.display = 'none';
		stateManager.save(0, 'ggggg rrrrr');
		var state = stateManager.load();
		gameInit(state);
	}
	document.getElementById('game-over-moves').innerHTML = '' + moves;

	showModal('game-over');

	scene = SCENE_GAMEOVER;
}
