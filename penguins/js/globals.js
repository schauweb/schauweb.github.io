"use strict";

const PENGUIN_W = 72;
const PENGUIN_H = 64;
const ICECUBE_W = 64;
const ICECUBE_H = 64;
const PLAYFIELD_W = (11 * PENGUIN_W);
const PLAYFIELD_H = (2 * PENGUIN_H);
const PENGUINS = 10;
const PIECES = (PENGUINS + 1)
const CANVAS_W = (ICECUBE_W + PLAYFIELD_W + ICECUBE_W);
const SCENE_INTRO = 0;
const SCENE_GAME = 1;
const SCENE_GAMEOVER = 2;

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var inputHandler = InputHandler();
var stateManager = StateManager();
var icecube = new Image();
var grey_penguins = new Image();
var red_penguins = new Image();
var fps = 60;
var start = Date.now();
var frameDuration = 1000 / fps;
var lag = 0;
var scene = SCENE_INTRO;
var penguins = [];