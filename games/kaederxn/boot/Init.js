"use strict";

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function runGame() {
    game = new Phaser.Game({
        backgroundColor: '#000', 
        physics: {
            default: 'arcade'
        },
        parent: 'game', 
        scene: {
            Interlude,
            Intro,
            Game,
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'game',
            width: SCREEN_W,
            height: SCREEN_H,
        },
    });

    game.scene.add('loader', Loader);
    game.scene.add('game', Game);
    game.scene.add('interlude', Interlude);
    game.scene.add('help', Help);
    game.scene.add('intro', Intro);
    game.scene.start('loader');
}