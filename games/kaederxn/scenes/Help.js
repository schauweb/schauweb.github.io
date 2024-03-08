"use strict";

class Help extends Phaser.Scene {
    constructor ()
    {
        super({ key: 'help' });
    }

    create() {
        this.goneBack = false;

        this.starsMgr = new StarsMgr();
        this.starsMgr.init(this)

        this.addLabel("score points by creating", COLOR_YELLOW, 80);
        this.addLabel("longer and longer chains", COLOR_YELLOW, 130);
        this.addLabel("of exploding balls.", COLOR_YELLOW, 180);
        this.addLabel("tap anywhere to start", COLOR_BLUE, 250);
        this.addLabel("the initial chain.", COLOR_BLUE, 300);
        this.addLabel("each round has a number", COLOR_YELLOW, 370);
        this.addLabel("of balls which must be", COLOR_YELLOW, 420);
        this.addLabel("removed before going on", COLOR_YELLOW, 470);
        this.addLabel("to the next round.", COLOR_YELLOW, 520);
        this.addLabel("there are 12 rounds.", COLOR_MAGENTA, 590);
        this.addLabel("click to continue.", COLOR_GREEN, 670);

        this.input.on('pointerdown', () => this.backToIntro());
        this.cameras.main.fadeIn(250, 0, 0, 0)
    }

    addLabel(text, color, position) {
        let lbl = this.add.text(SCREEN_W / 2, position, text, INTRO_FONT);
        lbl.setColor(color);
        lbl.setOrigin(0.5, 0.5);
    }

    update() {
    }

    backToIntro() {
        if (this.goneBack) {
            return;
        }

        this.goneBack = true;
        sndButtonPress.play();
    
        this.cameras.main.fadeOut(250, 0, 0, 0);
	    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('intro')
        });
    }
}