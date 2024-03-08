"use strict";

function setupInterlude(show, next) {
    interludeActualPage = show;
    interludeTransitionToScene = next;
}

class Interlude extends Phaser.Scene {
    constructor ()
    {
        super({ key: 'interlude' });
    }

    create() {
        this.interludeExited = false;
        this.starsMgr = new StarsMgr();
        this.starsMgr.init(this)

        if (interludeActualPage == INTERLUDE_FIRST_ROUND) {
            this.iFirstRound();
        } else if (interludeActualPage == INTERLUDE_ROUND_X) {
            this.iRoundX();
        } else if (interludeActualPage == INTERLUDE_ROUND_COMPLETED) {
            this.iRoundCompleted();
        } else if (interludeActualPage == INTERLUDE_MISSION_ACCOMPLISHED) {
            this.iMissionAccomplished();
        } else if (interludeActualPage == INTERLUDE_ROUND_FAILED) {
            this.iRoundFailed();
        }
        
        this.input.on('pointerdown', () => this.exitPage());
        this.cameras.main.fadeIn(250, 0, 0, 0)
    }

    addLabel(text, color, position) {
        let lbl = this.add.text(SCREEN_W / 2, position, text, INTERLUDE_FONT);
        lbl.depth = DEPTH_TEXT;
        lbl.setColor(color);
        lbl.setOrigin(0.5, 0.5);
    }

    clickToContinue(position) {
        this.addLabel("Click to continue", COLOR_GREEN, position);
    }

    getBalls(position) {
        let text = "Get " + rounds[gdRound][1] + " of " + rounds[gdRound][0] + " balls";
        let lbl = this.add.text(SCREEN_W / 2, position, text, INTERLUDE_FONT);
        lbl.depth = DEPTH_TEXT;
        lbl.setColor(COLOR_BLUE);
        lbl.setOrigin(0.5, 0.5);
    }

    exitPage() {
        if (this.interludeExited) {
            return;
        }

        this.interludeExited = true;
        sndButtonPress.play();
    
        this.cameras.main.fadeOut(250, 0, 0, 0);
	    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start(interludeTransitionToScene);
        });
    }

    update() {
    }

    iFirstRound() {
        this.addLabel("First round", COLOR_GREEN, 270)
        this.getBalls(370);
        this.clickToContinue(470);
    }

    iRoundX() {
        if (gdRound == (rounds.length - 1)) {
            this.addLabel("Last Round", COLOR_BLUE, 270);
        } else {
            this.addLabel("Round " + gdRound, COLOR_BLUE, 270);
        }

        this.getBalls(370);
        this.clickToContinue(470);
    }

    iRoundCompleted() {
        this.addLabel("Round Completed", COLOR_GREEN, 70);
        this.addLabel("Round score: " + roundScore, COLOR_LIGHT_GRAY, 170);
        if (roundChainBonus > 0) {
            this.addLabel("Chain Bonus: " + roundChainBonus, COLOR_LIGHT_GRAY, 270);
        } else {
            this.addLabel("No Chain Bonus", COLOR_RED, 270);
        }
        this.addLabel("Total Score: " + gdTotal, COLOR_LIGHT_GRAY, 370);

        if (gdRound == (rounds.length - 1)) {
            this.addLabel("Now play last round", COLOR_BLUE, 470);
        } else {
            this.addLabel("Now play round " + gdRound, COLOR_BLUE, 470);
        }

        this.getBalls(570);
        this.clickToContinue(670);
    }

    iMissionAccomplished() {
        this.addLabel("Mission Accomplished", COLOR_GREEN, 120);
        this.addLabel("Round score: " + roundScore, COLOR_LIGHT_GRAY, 220);
        if (roundChainBonus > 0) {
            this.addLabel("Chain Bonus: " + roundChainBonus, COLOR_LIGHT_GRAY, 320);
        } else {
            this.addLabel("No Chain Bonus", COLOR_RED, 320);
        }
        this.addLabel("Total Score: " + gdTotal, COLOR_LIGHT_GRAY, 420);

        if (newHiScore) {
            this.addLabel("New high score!", COLOR_GREEN, 520);
        }

        this.clickToContinue(620);
    }

    iRoundFailed() {
        this.addLabel("Round Failed", COLOR_RED, 120);
        this.addLabel("Round Penalty: " + penalty, COLOR_RED, 220);

        this.addLabel("" + goal + " more ball" + (goal == 1 ? "" : "s"), COLOR_LIGHT_GRAY, 320);

        if (gdRound == (rounds.length - 1)) {
            this.addLabel("Replay last round", COLOR_BLUE, 420);
        } else {
            this.addLabel("Replay round " + gdRound, COLOR_BLUE, 420);
        }

        this.getBalls(520);
        this.clickToContinue(620);
    }
}