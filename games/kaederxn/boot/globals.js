"use strict";

const SCREEN_W = 1334;
const SCREEN_H = 750;
const STARSIZE = 3;
const STARSPACE_X = 58;
const STARSPACE_Y = 50;

const INTERLUDE_FIRST_ROUND = 1;
const INTERLUDE_ROUND_X = (INTERLUDE_FIRST_ROUND + 1);
const INTERLUDE_ROUND_COMPLETED = (INTERLUDE_ROUND_X + 1);
const INTERLUDE_MISSION_ACCOMPLISHED = (INTERLUDE_ROUND_COMPLETED + 1);
const INTERLUDE_ROUND_FAILED = (INTERLUDE_MISSION_ACCOMPLISHED + 1);

const DEPTH_STARS = 1;
const DEPTH_TEXT = 1000;
const DEPTH_PLAYER = 3;
const DEPTH_BALLS = 10;

const BALLSTATE_DEAD = 0;
const BALLSTATE_IDLE = (BALLSTATE_DEAD + 1);
const BALLSTATE_GROW = (BALLSTATE_IDLE + 1);
const BALLSTATE_SHRINK = (BALLSTATE_GROW + 1);
const BALLSTATE_MOVE = (BALLSTATE_SHRINK + 1);
const BALLSTATE_PLAYER = (BALLSTATE_MOVE + 1);

const CHAIN_BONUS = 10000;

const COLOR_LIGHT_GRAY = "#d3d3d3";
const COLOR_WHITE = "#ffffff";
const COLOR_GREEN = "#77dd77";
const COLOR_YELLOW = "#fff9a0";
const COLOR_BLUE = "#a5c6e8";
const COLOR_RED = "#f9a0a0";
const COLOR_CYAN = "#a3d8d8";
const COLOR_PURPLE = "#c1afe0";
const COLOR_BROWN = "#826854";
const COLOR_MAGENTA = "#f499c1";
const COLOR_ORANGE = "#f7c699";
const BALL_STROKE_COLOR = 0x3f3f3f;

const INTERLUDE_FONT = { fontSize: '70px', fontFamily: 'SpeedRush' };
const INTRO_FONT = { fontSize: '40px', fontFamily: 'SpeedRush' };
const BALL_FONT = { fontSize: '40px', fontFamily: 'SpeedRush' };
const INGAME_FONT = { fontSize: '40px', fontFamily: 'SpeedRush' };
const BALL_RADIUS = 16;
const BALL_GROW_SPEED = 3;
const BALL_SHRINK_SPEED = 5;

const BF_LEFT = BALL_RADIUS;
const BF_TOP = BALL_RADIUS;
const BF_RIGHT = SCREEN_W - BALL_RADIUS;
const BF_BOTTOM = SCREEN_H - BALL_RADIUS;
const MAX_BALLS = 60;

const logoColors = [
    "#68372B", "#70A4B2", "#6F3D86", "#588D43", "#352879",
	"#B8C76F", "#6F4F25", "#433900", "#9A6759", "#444444",
	"#6C6C6C", "#9AD284", "#6C5EB5", "#959595"
]
const ballColors = [
	0x77dd77, 0xfff9a0, 0xa5c6e8, 0xf9a0a0, 0xa3d8d8,
	0xc1afe0, 0x826854, 0xf499c1, 0xf7c699
]

const blinkColors = [
	COLOR_GREEN, COLOR_YELLOW, COLOR_BLUE, COLOR_RED, COLOR_CYAN,
	COLOR_PURPLE, COLOR_BROWN, COLOR_MAGENTA, COLOR_ORANGE
]

// Balls, goal, max-radius, idle
const rounds = [
	[0, 0, 0, 0],
	[5, 2, 100, 67],
	[10, 4, 100, 65],
	[15, 6, 95, 63],
	[20, 8, 95, 61],
	[25, 12, 90, 59],
	[30, 17, 85, 57],
	[35, 20, 80, 55],
	[40, 24, 75, 53],
	[43, 30, 70, 51],
	[47, 37, 65, 49],
	[52, 45, 60, 47],
	[55, 51, 60, 45]
];
var storage = new Storage();
var game;
// session variables
var gdRound;
var gdTotal;
var gdHiScore;

// in game variables
var balls = [];
var noOfBalls;
var goal;
var longestChain;
var roundScore;
var roundChainBonus;
var penalty;
var newHiScore;
var maxRadius;
var ballIdle;

// page transition
var interludeActualPage;
var interludeTransitionToScene;

// Sounds
var sndButtonPress;
var sndFire;
var sndMissionAccomplished;
var sndNay;
var sndRoundCompleted;
var sndStartNewRound;
var sndYay;

function rangeInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startRound(r) {
	gdRound = r;
	gdTotal = 0;
	noOfBalls = rounds[gdRound][0];
	goal = rounds[gdRound][1];
	maxRadius = rounds[gdRound][2];
	ballIdle = rounds[gdRound][3];
	balls = [];
	for (var i = 0; i < MAX_BALLS; i++) {
		balls[i] = null;
	}
}

function loadSession() {
	gdRound = storage.exists("round") ? storage.get("round") : 0;
	gdTotal = storage.exists("total") ? storage.get("total") : 0;
}

function saveSession() {
	storage.set("round", gdRound);
	storage.set("total", gdTotal);
}

function loadHiScore() {
	gdHiScore = storage.exists("hiscore") ? storage.get("hiscore") : 0;
}

function saveHiScore() {
	storage.set("hiscore", gdHiScore);
}