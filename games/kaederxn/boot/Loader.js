"use strict";

class Loader {
    preload() {
        this.starsSprites = this.load.spritesheet('star', 'img/stars.png', { 
            frameWidth: STARSIZE, 
            frameHeight: STARSIZE, 
        });

        this.load.spritesheet('mutebutton', 'img/mutebutton.png', { 
            frameWidth: 40, 
            frameHeight: 40, 
        }); 

        this.load.spritesheet('helpbutton', 'img/helpbutton.png', { 
            frameWidth: 40, 
            frameHeight: 40, 
        }); 

        this.load.audio('music', ['sounds/TranquilTranceExpress.mp3']);
        this.load.audio('buttonpress', ['sounds/buttonpress.mp3']);
        this.load.audio('explosion', ['sounds/explosion.mp3']);
        this.load.audio('fire', ['sounds/fire.mp3']);
        this.load.audio('missionaccomplished', ['sounds/mission-accomplished.mp3']);
        this.load.audio('nay', ['sounds/nay.mp3']);
        this.load.audio('roundcompleted', ['sounds/round-completed.mp3']);
        this.load.audio('startnewround', ['sounds/start-new-round.mp3']);
        this.load.audio('yay', ['sounds/yay.mp3']);
        this.loadLabel = this.add.text(SCREEN_W / 2, SCREEN_H / 2, 'Loading: 0%', INTRO_FONT).setOrigin(0.5, 0.5);
        this.load.on('progress', this.progress, this);
    }

    progress(value) {
        let percentage = Math.round(value * 100) + '%';
        this.loadLabel.setText('Loading: ' + percentage);
    }

    create() {
        loadHiScore();

        this.anims.create({
            key: 'star',
            frames: this.anims.generateFrameNumbers('star', { start: 0, end: 199 }),
            frameRate: 8,
            repeat: -1,
        });

        let music = this.sound.add('music');
        music.loop = true;
        this.sound.mute = true;
        music.play();

        sndButtonPress = this.sound.add('buttonpress');
        sndFire = this.sound.add('fire');
        sndMissionAccomplished = this.sound.add('missionaccomplished');
        sndNay = this.sound.add('nay');
        sndRoundCompleted = this.sound.add('roundcompleted');
        sndStartNewRound = this.sound.add('startnewround');
        sndYay = this.sound.add('yay');

        loadSession();
        if (gdRound >= rounds.length) {
            gdRound = 0;
        }

        if (gdRound == 0) {
            this.scene.start('intro');
            return;
        }

        setupInterlude(gdRound == 1 ? INTERLUDE_FIRST_ROUND : INTERLUDE_ROUND_X, 'game');
        this.scene.start('interlude')
    }
}
