"use strict";

function introRun() {
	document.onkeydown = (e) => { handleUpKey(e, "game"); };
    document.onclick = () => { olge.activateAudio(); };
}

function introRender(lagOffset) {
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    olge.drawString("J U G G L E", S_MIDDLE, 10, "#559", "center");

    var x = olge.drawString("Juggle balls until", S_MIDDLE, 40, "#594", "center");
    olge.drawString("you drop one.", x, 50, "#594");

    x = olge.drawString("Use cursor left and", S_MIDDLE, 70, "#955", "center");
    olge.drawString("right to juggle.", x, 80, "#955");

    olge.drawString("Up key to start", S_MIDDLE, 100, "#995", "center");
}
