"use strict";

function showIntro() {
	penguinRollerSetup();
	document.getElementById('intro-close').onclick = function(event) {
		event.preventDefault();
		document.getElementById("intro").style.display = 'none';
		stateManager.save(0, 'ggggg rrrrr');
		var state = stateManager.load();
		gameInit(state);
	}

	var parent = document.getElementById('main').getBoundingClientRect();
	var elem = document.getElementById('intro-content');
	elem.style.top = (10 + parent.top) + 'px';

	document.getElementById('intro').style.display = 'block';

	scene = SCENE_INTRO;
}