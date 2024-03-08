"use strict";

const STARSPACE = 80;
const stars_x = [];
const stars_y = [];
const stars_color = [];
const stars_fading_idx = [];
const stars_fading_anim = [];
const stars_anim = [ 153, 178, 204, 229, 255, 229, 204, 178, 153, 127 ];
var stars_c, stars_l, stars_fade_speed;

function stars_init(w, h) {
    stars_c = parseInt(w / STARSPACE);
    stars_l = parseInt(h / STARSPACE);

    var y = 0;
    for (var l = 0; l < stars_l; l++) {
        var x = 0;
        for (var c = 0; c < stars_c; c++) {
            var idx = random(0, STARSPACE * STARSPACE);
            stars_x.push((idx % STARSPACE) + x);
            stars_y.push((idx / STARSPACE) + y);
            stars_color.push(stars_anim[stars_anim.length - 1]);
            x += STARSPACE;
        }
        stars_fading_idx.push(random(0, stars_c));
        stars_fading_anim.push(random(0, 20));
        y += STARSPACE;
    }

    stars_fade_speed = 0;
}

function stars_update() {
    if (stars_fade_speed > 0) {
        stars_fade_speed--;
        return;
    }

    stars_fade_speed = 7;
    for (var i = 0; i < stars_l; i++) {
        stars_fading_anim[i]--;
        if (stars_fading_anim[i] > -2) {
            continue;
        }

        var ai = Math.abs(stars_fading_anim[i]);
        if (ai <= stars_anim.length) {
            stars_color[(i * stars_c) + stars_fading_idx[i]] = stars_anim[ai];
            continue;
        }

        stars_fading_anim[i] = random(0, 20);
        stars_fading_idx[i] = random(0, stars_c);
    }
}

function stars_render(ctx) {
	const starSize = 5;
    for (var i = 0; i < stars_x.length; i++) {
        var c = stars_color[i];
		ctx.fillStyle = "rgb(" + c + "," + c + "," + c + ")";
		ctx.fillRect(stars_x[i], stars_y[i], starSize, starSize);
    }
}
