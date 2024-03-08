"use strict";

class StarsMgr {
    init(phaser) {
        this.stars_c = parseInt(SCREEN_W / STARSPACE_X) + 1;
        this.stars_l = parseInt(SCREEN_H / STARSPACE_Y) + 1;
        var y = 0;
        for (var l = 0; l < this.stars_l; l++) {
            var x = 0;
            for (var c = 0; c < this.stars_c; c++) {

                var pos = random(0, STARSPACE_X * STARSPACE_Y);
                var sX = x + (pos % STARSPACE_X);
                var sY = y + (pos / STARSPACE_Y);

                var sprite = phaser.physics.add.sprite(sX, sY, 'star');
                sprite.depth = 1;
                sprite.anims.play({ key: 'star', startFrame: random(0, 199) });
                x += STARSPACE_X;
            }
            y += STARSPACE_Y;
        }
    }
}