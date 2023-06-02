"use strict";

function showIntro() {
	penguinRollerSetup();
	document.getElementById('intro-close').onclick = function(event) {
		event.preventDefault();
		penguinRollerCalm();
		hideModal('intro', hideIntro);
	}

	showModal('intro');
	scene = SCENE_INTRO;
}

function hideIntro() {
	scene = SCENE_CALM;
}
