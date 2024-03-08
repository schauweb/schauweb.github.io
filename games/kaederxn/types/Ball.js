"use strict";

class Ball {
    init(ballNo, color, maxRadius, ballIdle) {
        this.state = BALLSTATE_MOVE;
        this.ballNo = ballNo;
        this.color = color;
        this.maxRadius = maxRadius;
        this.ballIdle = ballIdle;
        this.x = rangeInt(BF_LEFT, BF_RIGHT);
        this.y = rangeInt(BF_TOP, BF_BOTTOM);
        this.speedX = this.getSpeed();
        this.speedY = this.getSpeed();
        this.radius = BALL_RADIUS;
        this.parentBall = null;
        this.chainDepth = 0;
    }

    getSpeed() {
        var speed = rangeInt(3, 5);
        return rangeInt(0, 49) >= 25 ? speed : -speed;
    }

    add(phaser) {
        const s = phaser.add.circle(this.x, this.y, this.radius, this.color);
        s.setOrigin(0.5, 0.5);
        s.depth = this.ballNo + DEPTH_BALLS;
        s.setStrokeStyle(1, BALL_STROKE_COLOR, 1.0);
        this.sprite = s;
    }

    move() {
        this.x += this.speedX;
        if (this.x <= BF_LEFT || this.x >= BF_RIGHT) {
            this.speedX = -this.speedX;
            this.x += this.speedX;
        }

        this.y += this.speedY;
        if (this.y <= BF_TOP || this.y >= BF_BOTTOM) {
            this.speedY = -this.speedY;
            this.y += this.speedY;
        }

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    grow() {
        if (this.radius < this.maxRadius) {
            this.radius += BALL_GROW_SPEED;
            this.sprite.radius = this.radius;
            return;
        }

        this.radius = this.maxRadius;
        this.sprite.radius = this.radius;
        this.pause = this.ballIdle;
        this.state = BALLSTATE_IDLE;
    }

    idle() {
        if (this.pause > 0) {
            this.pause--;
            return;
        }

        this.state = BALLSTATE_SHRINK;
    }

    shrink() {
        const r = this.radius - BALL_SHRINK_SPEED;
        
        this.radius = r;
        this.sprite.radius = this.radius;
        if (r > 0) {
            return
        }

        this.state = BALLSTATE_DEAD;
    }
}