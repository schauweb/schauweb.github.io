"use strict";

function loadAssets() {
	olge.init("game", SCREEN_W, SCREEN_H);
	olge.setFont("5px MicroChat", 6, 7);
	olge.setScenes(scenes);
	olge.load(assets, () => olge.activateScene("intro"));
}

function handleUpKey(e, scene) {
	if (e.key !== "ArrowUp") {
		return;
	}

	olge.activateScene(scene);
}
