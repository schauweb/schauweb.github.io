"use strict";

const ROLLER_DELAY = 180;

var Penguin = function() {
    const walking_sequence = [ 71,71,70,70,69,69,68,66,65,63,60,57,54,50,46,41,36,30,23,16,8,0 ];
    const jumping_sequence = [ 0,8,17,26,35,40,45,49,54,59,63,63,59,54,49,45,40,35,26,17,8,0 ];
    const sliding_sequence = [ 143,143,143,143,142,141,139,137,134,130,126,120,114,106,98,88,77,65,51,35,18,0 ];
    const DEFAULT_FRAME = 6;
    const STILL = 0;
    const YUCKKING = 1;
    const WALKING = 2;
    const JUMPING = 3;
    const SLIDING = 4;
    var p = {};
    p.oldX = 0;
    p.oldY = 0;
    p.frame = DEFAULT_FRAME;
    p.animationType = STILL;
    p.frameStart = 0;
    p.frameLength = 0;
    p.pause = 0;

    p.init = function(sheet, x, y, type, facing) {
        p.sheet = sheet;
        p.x = x;
        p.visualX = x;
        p.y = y;
        p.visualY = y;
        p.type = type;
        p.facing = facing;
        p.animationType = STILL
    };

    p.render = function(ctx, lagOffset) {
        var rX = ((p.visualX - p.oldX) * lagOffset + p.oldX) + ICECUBE_W;
        var rY = ((p.visualY - p.oldY) * lagOffset + p.oldY);

        var sX = p.frame * PENGUIN_W;
        var sY = p.facing == 1 ? 0 : PENGUIN_H

        ctx.drawImage(p.sheet, sX, sY, PENGUIN_W, PENGUIN_H, rX, rY, PENGUIN_W, PENGUIN_H);
        p.oldX = p.visualX;
        p.oldY = p.visualY;
    }

    p.yuck = function() {
        p.frame = 0;
        p.animationType = YUCKKING;
    }

    p.isYuckking = function() {
        return p.animationType == YUCKKING;
    }

    p.resetFrame = function() {
        p.frame = DEFAULT_FRAME;
        p.animationType = STILL;
    }

    p.setupAnimation = function(animType, sequence, start, end) {
        p.animationType = animType;
        p.sequence = sequence;
        p.frameStart = start;
        p.frameEnd = end;
        p.animIndex = 0;
        p.frame = start;
        p.animSpeed = 0;
    }

    p.animating = function() {
        return p.animationType == WALKING ||
                p.animationType == SLIDING ||
                p.animationType == JUMPING;
    }

    p.walk = function(direction) {
        p.facing = direction;
        p.x += p.facing * PENGUIN_W;
        p.setupAnimation(WALKING, walking_sequence, 6, 9);
    }

    p.jump = function() {
        p.setupAnimation(JUMPING, jumping_sequence, 1, 3);
    }

    p.slide = function(direction) {
        p.facing = direction;
        p.x += p.facing * (PENGUIN_W * 2);
        p.setupAnimation(SLIDING, sliding_sequence, 4, 5);
    }

    p.animate = function() {
        if (p.animationType == STILL || p.animationType == YUCKKING) {
            return;
        }

        if (p.animIndex >= p.sequence.length) {
            p.resetFrame();
            return;
        }

        if (p.animationType == JUMPING) {
            p.visualY = p.y - p.sequence[p.animIndex];
            if (p.animIndex < 4) {
                p.frame = 1;
            } else if (p.animIndex < 12) {
                p.frame = 2;
            } else {
                p.frame = 3;
            }
        } else if (p.animationType == SLIDING) {
            p.visualX = p.x - (p.facing * p.sequence[p.animIndex]);
            if (p.animIndex < 3) {
                p.frame = 4;
            } else {
                p.frame = 5;
            }
        } else if (p.animationType == WALKING) {
            p.visualX = p.x - (p.facing * p.sequence[p.animIndex]);
            p.animSpeed++;
            if (p.animSpeed > 2) {
                p.frame++;
                p.animSpeed = 0;
            }

            if (p.frame > p.frameEnd) {
                p.frame = p.frameStart;
            }
        }

        p.animIndex++;
    }

    return p;
}

function loadDefaultPenguins() {
	penguins = [];
	for (var x = 0; x < (5 * PENGUIN_W); x += PENGUIN_W) {
		addPenguin(x, 'g', 1);
	}

	for (var x = 6 * PENGUIN_W; x < (11 * PENGUIN_W); x += PENGUIN_W) {
		addPenguin(x, 'r', -1);
	}
}

function loadPenguins(setup) {
	penguins = [];
	for (var i = 0; i < PIECES; i++) {
		var p = setup[i];
		if (p == 'G') {
			addPenguin(i * PENGUIN_W, 'g', -1);
		} else if (p == 'g') {
			addPenguin(i * PENGUIN_W, 'g', 1);
		} else if (p == 'R') {
			addPenguin(i * PENGUIN_W, 'r', 1);
		} else if (p == 'r') {
			addPenguin(i * PENGUIN_W, 'r', -1);
		}
	}
}

function addPenguin(x, type, face) {
	var penguin = Penguin();
	var sheet = type == 'g' ? grey_penguins : red_penguins;
	penguin.init(sheet, x, PENGUIN_H, type, face);
	penguins.push(penguin);
}

function penguinRollerSetup() {
    for (var i = 0; i < PENGUINS; i++) {
        penguins[i].pause = Math.random() * ROLLER_DELAY;
    }
}

function penguinRoller() {
    for (var i = 0; i < PENGUINS; i++) {
        var p = penguins[i];
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
}