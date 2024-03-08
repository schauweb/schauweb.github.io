"use strict";

const SCREEN_W = 130;
const S_MIDDLE = parseInt(SCREEN_W / 2);
const SCREEN_H = 120;
const MIDDLE_BALL = 50;
const B_OUTER = 0;
const B_MIDDLE = 1;
const B_INNER = 2;

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var assets = new Map([
	[ "jugglel", "gfx/jugglel.png" ],
	[ "jugglem", "gfx/jugglem.png" ],
	[ "juggler", "gfx/juggler.png" ],
	[ "ball", "gfx/ball.png" ],
	[ "nay", "snd/nay.mp3" ],
	[ "save", "snd/save.mp3" ],
	[ "start", "snd/start.mp3" ],
]);
const scenes = new Map([
	[ "intro", [ introRun, "ignore", introRender ] ],
	[ "game", [ gameRun, gameUpdate, gameRender ] ],
	[ "end", [ endRun, "ignore", endRender ] ],
]);
var olge = new OLGE();