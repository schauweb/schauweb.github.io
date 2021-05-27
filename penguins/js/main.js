"use strict";

icecube.addEventListener('load', function() {
	grey_penguins.addEventListener('load', function() {
		red_penguins.addEventListener('load', function() {
			init();
			loop();
		});
		red_penguins.src = 'img/red-penguins.png';
	});
	grey_penguins.src = 'img/grey-penguins.png';
}, false);
icecube.src = 'img/icecube.png';

/* setup for game over */
//stateManager.save(10, 'rRrR rGgGgG');

function init() {
	inputHandler.init(canvas, clickDown, clickUp, mouseMove);
	var state = stateManager.load();
	if (state == null) {
		loadDefaultPenguins();
		showIntro();
		return;
	}

	gameInit(state);
}

function setCanvasPosition() {
	var left = ((window.innerWidth - CANVAS_W) / 2) + "px";
	canvas.style.left = left;
}

setCanvasPosition();

window.addEventListener('resize', function () {
	setCanvasPosition();
});

function loop() {
	requestAnimationFrame(loop, canvas);

	var current = Date.now();
	var elapsed = current - start;
	start = current;
	lag += elapsed;

	while (lag >= frameDuration){
		if (scene == SCENE_GAME) {
			gameUpdate();
		} else {
			penguinRoller();
		}

		lag -= frameDuration;
	}

	var lagOffset = lag / frameDuration;
	render(lagOffset);
}

function render(lagOffset) {
	ctx.clearRect(0, 0, CANVAS_W, PLAYFIELD_H);
	ctx.drawImage(icecube, 0, 64);
	ctx.drawImage(icecube, ICECUBE_W + PLAYFIELD_W, 64);

	for (var i = 0; i < PENGUINS; i++) {
		var penguin = penguins[i];
		ctx.save();
		penguin.render(ctx, lagOffset);
		ctx.restore();
	}

	if (scene != SCENE_GAME) {
		return;
	}

	var movesElem = document.getElementById('moves');
	movesElem.innerHTML = '' + moves
}
