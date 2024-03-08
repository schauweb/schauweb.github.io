"use strict";

function endRun() {
    olge.playAudio("nay");
	document.onkeydown = (e) => { handleUpKey(e, "intro"); };
}

function endRender(lagOffset) {
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    olge.drawString("Game Over", S_MIDDLE, 30, "#b33", "center");
    olge.drawString("You scored:", S_MIDDLE, 50, "#594", "center");
    olge.drawString('' + score, S_MIDDLE, 70, "#559", "center");
    olge.drawString("Up key to continue", S_MIDDLE, 100, "#995", "center");
}
