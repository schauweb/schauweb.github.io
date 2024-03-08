"use strict";

const bOuter = [
	[3, 59], [5, 44], [11, 30], [21, 16], [35, 6], [51, 2],
	[71, 2], [87, 6], [101, 16], [111, 30], [117, 44], [119, 59]
];
const bMiddle = [
	[19, 59], [21, 46], [27, 34], [39, 24], [53, 18],
	[69, 18], [83, 24], [95, 34], [101, 47], [103, 59]
];
const bInner = [
	[35, 59], [40, 48], [47, 40], [55, 34],
	[67, 34], [75, 40], [83, 48], [87, 59]
];
var jugglePos, timerRate, timerReset;
var balls;
var score;

function gameRun() {
	olge.playAudio("start");
	jugglePos = 1;
	balls = [];
	setupBall(1, bOuter.length);
	setupBall(-1, bMiddle.length);
	setupBall(1, bInner.length);
	score = 0;
	timerReset = 1;
	setTimerRate();
	document.onkeydown = juggleMove;
}

function setupBall(add, length) {
	balls.push({
		idx: parseInt(length / 2),
		add: add,
		save: false,
		dead: false,
		length: length - 1,
	});
}

function setTimerRate() {
	if (score < 20) {
		timerRate = 30;
	} else if (score < 60) {
		timerRate = 26;
	} else if (score < 100) {
		timerRate = 22;
	} else if (score < 200) {
		timerRate = 18;
	} else if (score < 400) {
		timerRate = 14;
	} else if (score < 600) {
		timerRate = 10;
	} else {
		timerRate = 9;
	}
}

function juggleMove(e) {
	const callback = {
		"ArrowLeft"  : juggleLeft,
		"ArrowRight" : juggleRight,
	}[e.key]
	callback?.()
}

function juggleLeft() {
	if (jugglePos > 0) {
		jugglePos--;
		saveBalls();
	}
}

function juggleRight() {
	if (jugglePos < 2) {
		jugglePos++;
		saveBalls();
	}
}

function gameUpdate() {
	if (anyBallsDead()) {
		blinkBalls();
		return;
	}

	timerReset--;
	if (timerReset > 0) {
		return;
	}

	timerReset = timerRate;

	balls[B_OUTER].idx += balls[B_OUTER].add;
	balls[B_INNER].idx += balls[B_INNER].add;
	if (hasMiddleBall()) {
		balls[B_MIDDLE].idx += balls[B_MIDDLE].add;
	}

	saveBalls();

	ballMoved(balls[B_OUTER]);
	ballMoved(balls[B_INNER]);
	if (hasMiddleBall()) {
		ballMoved(balls[B_MIDDLE]);
	}

	if (anyBallsDead()) {
		document.onkeydown = {};
		timerReset = 1;
		timerRate = 0;
	}
}

function blinkBalls() {
	timerReset--;
	if (timerReset > 0) {
		return;
	}

	timerReset = 8;
	timerRate++;
    if (timerRate > 16) {
        olge.activateScene("end");
    }
}

function ballMoved(ball) {
	if (ball.idx < 0) {
		ball.idx = 0;
		ball.dead = true;
	} else if (ball.idx > ball.length) {
		ball.idx = ball.length;
		ball.dead = true;
	}
}

function anyBallsDead() {
	return balls[B_OUTER].dead ||
			balls[B_MIDDLE].dead ||
			balls[B_INNER].dead;
}

function gameRender(lagOffset) {
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

	const juggler = getJuggler(jugglePos);
	ctx.drawImage(assets.get(juggler[0]), juggler[1], 55);

	renderBall(balls[B_OUTER], bOuter);
	renderBall(balls[B_INNER], bInner);
	
	if (hasMiddleBall()) {
		renderBall(balls[B_MIDDLE], bMiddle);
	}

	olge.drawString('' + score, 1, 6, "#999");
}

function renderBall(ball, coords) {
	if (ball.dead && (timerRate % 2 == 0)) {
		return;
	}

	const pos = coords[ball.idx];
	ctx.drawImage(assets.get("ball"), pos[0], pos[1]);
}

function getJuggler(juggler) {
	if (juggler == 0) {
		return [ "jugglel", 1 ];
	} else if (juggler == 1) {
		return [ "jugglem", 17 ];
	}

	return [ "juggler", 29 ];
}

function hasMiddleBall() {
	return score > 30;
}

function saveBalls() {
	if (jugglePos == 0) {
		if (balls[B_OUTER].idx == 0) {
			saveBall(balls[B_OUTER], -1);
		}

		if (balls[B_INNER].idx == balls[B_INNER].length) {
			saveBall(balls[B_INNER], 1);
		}
	} else if (jugglePos == 1) {
		if (!hasMiddleBall()) {
			return;
		}

		if (balls[B_MIDDLE].idx == 0) {
			saveBall(balls[B_MIDDLE], -1);
		} else if (balls[B_MIDDLE].idx == balls[B_MIDDLE].length) {
			saveBall(balls[B_MIDDLE], 1);
		}
	} else {
		if (balls[B_INNER].idx == 0) {
			saveBall(balls[B_INNER], -1);
		}

		if (balls[B_OUTER].idx == balls[B_OUTER].length) {
			saveBall(balls[B_OUTER], 1);
		}
	}
}

function saveBall(ball, isAdd) {
	if (ball.add != isAdd) {
		return;
	}

	ball.add = -isAdd;
	score++;
	olge.playAudio("save");
}
