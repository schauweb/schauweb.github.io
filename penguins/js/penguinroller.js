"use strict";

function penguinRollerSetup() {
    penguins.forEach(p => { p.pause = Math.random() * ROLLER_DELAY; });
}

function penguinRollerCalm() {
    penguins.forEach(p => { p.calm(); });
}

function penguinRoller() {
	var allCalmed = true;
    for (var i = 0; i < PENGUINS; i++) {
        var p = penguins[i];
		if (p.isCalmed()) {
			continue;
		}

		allCalmed = false;

        if (p.animating()) {
            p.animate();
            continue;
        }

        if (p.pause > 0) {
            p.pause--;
            continue;
        }

        p.jump();
        p.pause = Math.random() * ROLLER_DELAY;
    }

	return allCalmed;
}
