"use strict";

class Intro extends Phaser.Scene {
    constructor ()
    {
        super({ key: 'intro' });
    }

    create() {
        this.gameStarted = false;
        this.logoColorIdx = -1;

        this.starsMgr = new StarsMgr();
        this.starsMgr.init(this)
  
        this.logoLabel = this.add.text(SCREEN_W / 2, -200, 'KaedeRxn', { fontSize: '210px', fontFamily: 'SpeedRush' });
        this.logoLabel.depth = DEPTH_TEXT;
        this.logoLabel.setOrigin(0.5, 0.5);
        this.changeLogoColor();
  
        this.addLabel("By Schau / Usher", COLOR_ORANGE, 320);
        this.addLabel("Sounds: Pixabay", COLOR_PURPLE, 370);
        this.addLabel("Font: Speed Rush", COLOR_PURPLE, 420);
        this.addLabel("Hi score", COLOR_LIGHT_GRAY, 480);
        this.addLabel("" + gdHiScore, COLOR_CYAN, 530);
        this.addLabel("Click to continue", COLOR_GREEN, 600);
  
        this.muteButton = this.add.sprite(40, SCREEN_H - 50, 'mutebutton');
        this.muteButton.depth = DEPTH_TEXT;
        this.muteButton.setInteractive({ useHandCursor: true });
        this.muteButton.on('pointerdown', this.toggleSound, this);
        this.muteButton.setFrame(this.sound.mute ? 1 : 0);
  
        this.helpButton = this.add.sprite(SCREEN_W - 40, SCREEN_H - 50, 'helpbutton');
        this.helpButton.depth = DEPTH_TEXT;
        this.helpButton.setInteractive({ useHandCursor: true });
        this.helpButton.on('pointerdown', this.showHelp, this);
        this.helpButton.setFrame(0);

        this.input.on('pointerdown', () => this.startGame());
        this.cameras.main.fadeIn(250, 0, 0, 0)
    }

    addLabel(text, color, position) {
        let lbl = this.add.text(SCREEN_W / 2, position, text, INTRO_FONT);
        lbl.depth = DEPTH_TEXT;
        lbl.setColor(color);
        lbl.setOrigin(0.5, 0.5);
    }

    bounceIn() {
        var logoTweenIn = this.tweens.add({
            targets: this.logoLabel, 
            y: 200,
            duration: 2000, 
            ease: 'bounce.out',
        });
        logoTweenIn.on('complete', () => { this.bounceOut() });
    }

    bounceOut() {
        var logoTweenOut = this.tweens.add({
            targets: this.logoLabel, 
            y: -200,
            duration: 2000, 
            ease: 'bounce.in',
            delay: 3000,
        });
        logoTweenOut.on('complete', () => { this.changeLogoColor() });
    }

    changeLogoColor() {
        this.logoColorIdx++;
        if (this.logoColorIdx >= logoColors.length) {
            this.logoColorIdx = 0;
        }
        this.logoLabel.setColor(logoColors[this.logoColorIdx]);
        this.bounceIn();
    }
    
    update() { }

    startGame() {
        if (this.gameStarted) {
            return;
        }

        this.gameStarted = true;
        sndButtonPress.play();
    
        this.cameras.main.fadeOut(250, 0, 0, 0);
	    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            setupInterlude(INTERLUDE_FIRST_ROUND, 'game');
            startRound(1);
            this.scene.start('interlude')
        });
    }

    toggleSound(pointer, localX, localY, event) {
        if (this.sound.mute) {
            this.sound.mute = false;
            this.muteButton.setFrame(0);
        } else {
            this.sound.mute = true;
            this.muteButton.setFrame(1);
        }

        sndButtonPress.play();
        event.stopPropagation();
    }

    showHelp(pointer, localX, localY, event) {
        this.helpButton.on('pointerdown', function() {} , this);
        sndButtonPress.play();
        event.stopPropagation();

        this.cameras.main.fadeOut(250, 0, 0, 0);
	    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('help')
        });
    }
}
