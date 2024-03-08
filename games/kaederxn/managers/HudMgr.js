"use strict";

class HudMgr {
    init(phaser) {
        this.blinkInited = false;
        this.blinkIndex = 0;
        this.blinkDelay = 0;

        this.ballsCnt = phaser.add.text(0, 0, "\u{2b24} " + goal, INGAME_FONT);
        this.ballsCnt.depth = DEPTH_TEXT;
        this.ballsCnt.setColor(COLOR_LIGHT_GRAY);
        this.ballsCnt.setOrigin(0, 0);

        this.score = phaser.add.text(0, 0, '' + (gdTotal + roundScore), INGAME_FONT);
        this.score.depth = DEPTH_TEXT;
        this.score.setAlign('right');
        this.score.setColor(COLOR_LIGHT_GRAY);
        this.score.setOrigin(0, 0);
        var height = this.score.style.fixedHeight;
        this.score.setFixedSize(SCREEN_W, height);

        this.blinkingBalls = [];
        var x = 0;
        for (var i = 0; i < 6; i++) {
            var lbl = phaser.add.text(x, 0, "\u{2b24}", INGAME_FONT);
            lbl.visible = false;
            lbl.depth = DEPTH_TEXT;
            lbl.setColor(COLOR_LIGHT_GRAY);
            lbl.setOrigin(0, 0);
            this.blinkingBalls.push(lbl);
            x += 36;
        }

        this.setBlinkingBallColors();
    }

    update() {
        this.score.text = '' + (gdTotal + roundScore);

        if (this.blinkInited) {
            return;
        }

        if (goal == 0) {
            this.setupBlinking();
            return;
        }

        this.ballsCnt.text = "\u{2b24} " + ((goal == 1) ? "last" : goal);
    }

    setupBlinking() {
        this.ballsCnt.visible = false;

        for (var i = 0; i < this.blinkingBalls.length; i++) {
            this.blinkingBalls[i].visible = true;
        }

        this.setBlinkingBallColors();
        this.blinkInited = true;
    }

    blink() {
        if (!this.blinkInited) {
            return;
        }
        
        if (this.blinkDelay < 8) {
            this.blinkDelay++;
            return;
        }

        this.blinkDelay = 0;
        this.blinkIndex++;
        if (this.blinkIndex >= blinkColors.length) {
            this.blinkIndex = 0;
        }
        this.setBlinkingBallColors();
    }

    setBlinkingBallColors() {
        var idx = this.blinkIndex;
        for (var i = 0; i < this.blinkingBalls.length; i++) {
            this.blinkingBalls[i].setColor(blinkColors[idx]);
            idx++;
            if (idx >= blinkColors.length) {
                idx = 0;
            }
        }
    }
}