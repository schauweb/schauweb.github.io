"use strict";

/* setup for game over */
//stateManager.save(10, 'rRrR rGgGgG');
var displayScale;
var start = 0;
var music = Music();

function positionHorizontal(canvas, soundCtrl) {
	var margin = (window.innerWidth - canvas.offsetWidth * displayScale) / 2;
	canvas.style.marginTop = "0px";
	canvas.style.marginBottom = "0px";
	canvas.style.marginLeft = margin + "px";
	canvas.style.marginRight = margin + "px";

	soundCtrl.style.marginTop = "0px";
	soundCtrl.style.marginBottom = "0px";
	soundCtrl.style.marginLeft = margin + "px";
	soundCtrl.style.marginRight = margin + "px";
}

function positionVertical(canvas, soundCtrl) {
	var margin = (window.innerHeight - canvas.offsetHeight * displayScale) / 2;
	canvas.style.marginTop = margin + "px";
	canvas.style.marginBottom = margin + "px";
	canvas.style.marginLeft = "0px";
	canvas.style.marginRight = "0px";

	soundCtrl.style.marginTop = margin + "px";
	soundCtrl.style.marginBottom = margin + "px";
	soundCtrl.style.marginLeft = "0px";
	soundCtrl.style.marginRight = "0px";
}

function scale(canvas, soundCtrl) {
	var sX = window.innerWidth / canvas.offsetWidth;
	var sY = window.innerHeight / canvas.offsetHeight;
	displayScale = Math.min(sX, sY);
	canvas.style.transform = "scale(" + displayScale + ")";
	soundCtrl.style.transform = "scale(" + displayScale +")";

	if (canvas.offsetWidth > canvas.offsetHeight) {
		if (canvas.offsetWidth * displayScale < window.innerWidth) {
			positionHorizontal(canvas, soundCtrl);
			return;
		}

		positionVertical(canvas, soundCtrl);
		return;
	}

	if (canvas.offsetHeight * displayScale < window.innerHeight) {
		positionVertical(canvas, soundCtrl);
		return;
	}

	positionHorizontal(canvas, soundCtrl);
}

function handleDisplayChange() {
	scale(document.getElementById('game'), document.getElementById('sound-ctrl'));
}

window.addEventListener('resize', handleDisplayChange, false);
window.addEventListener('orientationchange', handleDisplayChange, false);

background.addEventListener('load', function() {
	grey_penguins.addEventListener('load', function() {
		red_penguins.addEventListener('load', function() {
			document.getElementById('gamepage').style.display = "block";
			mainGameHandler();
		});
		red_penguins.src = 'assets/red-penguins.png';
	});
	grey_penguins.src = 'assets/grey-penguins.png';
});
background.src = 'assets/background.png';

function mainGameHandler() {
	music.init(document);
	music.stop();
	setSoundCtrl();
	document.getElementById('sound-ctrl').onclick = function(event) {
		if (music.playing) {
			music.stop();
		} else {
			music.start();
		}

		setSoundCtrl();
	}
	init();
	start = Date.now();
	loop();
}

function setSoundCtrl() {
	var soundCtrl = document.getElementById('sound-ctrl');
	soundCtrl.innerHTML = music.playing ? "\u{1F507}" : "\u{1F508}";
}

function init() {
	handleDisplayChange();
	inputHandler.init(canvas, clickDown, clickUp, mouseMove);
	var state = stateManager.load();
	if (state === null) {
		loadDefaultPenguins();
		showIntro();
		return;
	}

	gameInit(state);
}

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
			var allCalmed = penguinRoller();
			if (scene === SCENE_CALM) {
				if (allCalmed) {
					stateManager.save(0, 'ggggg rrrrr');
					var state = stateManager.load();
					gameInit(state);
				}
			}
		}

		lag -= frameDuration;
	}

	var lagOffset = lag / frameDuration;
	render(lagOffset);
}

function render(lagOffset) {
	ctx.drawImage(background, 0, 0);
	renderCenteredText('Penguins', 40, 2);
	renderCenteredText('Code: Brian Schau (https://schau.dk/) | Graphics: Game Art Guppy (https://www.gameartguppy.com/) | Music: Mr Lou ("Backfire")', 10, 380);

	for (var i = 0; i < PENGUINS; i++) {
		ctx.save();
		penguins[i].render(ctx, lagOffset);
		ctx.restore();
	}

	if (scene != SCENE_GAME) {
		return;
	}

	renderCenteredText('Moves: ' + moves, 20, 80);
}

function renderCenteredText(text, fontSize, offset) {
	offset += fontSize;
	ctx.font = fontSize + "px Potta One";
	var tmp = ctx.measureText(text);
	ctx.fillStyle = "#000";
	ctx.fillText(text, (PLAYFIELD_W + PENGUIN_X + PENGUIN_X - tmp.width) / 2, offset);
}

function showModal(name) {
	var elem = document.getElementById(name);
	var opacity = 0.0;
	elem.style.filter = 'alpha(opacity=0)';
	elem.style.display = 'block';
	var timer = setInterval(function () {
		opacity += 0.1;
		elem.style.opacity = opacity;
		elem.style.filter = 'alpha(opacity=' + opacity + ")";

		if (opacity < 1.0) {
			return;
		}

		clearInterval(timer);
	}, 50);
}

function hideModal(name, callback) {
	var elem = document.getElementById(name);
	var opacity = 1.0;
	var timer = setInterval(function () {
		elem.style.opacity = opacity;
		elem.style.filter = 'alpha(opacity=' + opacity + ")";
		opacity -= 0.1;

		if (opacity > 0.0) {
			return;
		}

		elem.style.display = 'none';
		clearInterval(timer);
		callback();
	}, 50);
}
