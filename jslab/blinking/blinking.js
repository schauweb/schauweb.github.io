"use strict";

var canvas = document.getElementById("stars");
var ctx = canvas.getContext("2d");
var screen_w, screen_h;
var fps = 60;
var start = Date.now();
var frameDuration = 1000 / fps;
var lag = 0;

function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function setWindowSize() {
	screen_w = document.body.clientWidth;
	screen_h = document.body.clientHeight;
	canvas.width = screen_w;
	canvas.height = screen_h;
}

setWindowSize();

window.addEventListener('resize', function () {
	setWindowSize();
});

stars_init(screen_w, screen_h);

function loop() {
	requestAnimationFrame(loop, canvas);

	var current = Date.now();
	var elapsed = current - start;
	start = current;
	lag += elapsed;

	while (lag >= frameDuration){
		update();
		lag -= frameDuration;
	}

	var lagOffset = lag / frameDuration;
	render(lagOffset);
}

function update() {
	stars_update();
}

function render(lagOffset) {
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	stars_render(ctx);
}

loop();
