"use strict";

class Game extends Phaser.Scene {
    constructor ()
    {
        super({ key: 'game' });
    }

    create() {
        this.gameLoaded = false;
        this.gameFinishing = false;
        this.starsMgr = new StarsMgr();
        this.starsMgr.init(this, SCREEN_W, SCREEN_H);
        startRound(gdRound);

        this.collisionDetectionEnabled = false;
        longestChain = 0;
        roundScore = 0;

        var player = new Ball();
        player.init(0, 0xffffff, maxRadius, ballIdle);
        player.state = BALLSTATE_PLAYER;
        player.radius = 1;
        balls[0] = player;

        var colorIndex = 0;
        for (var i = 1; i <= noOfBalls; i++) {
            var ball = new Ball();
            balls[i] = ball;
            ball.init(i, ballColors[colorIndex], maxRadius, ballIdle);
            ball.add(this);
            colorIndex++;
            if (colorIndex >= ballColors.length) {
              colorIndex = 0;
            }
        }

        this.input.on('pointerdown', (event) => this.fire(event));

        this.hudMgr = new HudMgr();
        this.hudMgr.init(this);
        this.hudMgr.update();

        this.cameras.main.fadeIn(250, 0, 0, 0)
        sndStartNewRound.play();
        this.startTime = Date.now();
        this.lag = 0;
        this.gameLoaded = true;
    }

    update(frameTime) {
        if (!this.gameLoaded) {
            return;
        }

        var current = Date.now();
        var elapsed = current - this.startTime;
        this.startTime = current;
        this.lag += elapsed;
        const frameDuration = 1000/60;
        while (this.lag > frameDuration) {
          this.innerUpdate();
          this.lag -= frameDuration;
        }
    }

    innerUpdate() {
        if (!this.gameFinishing) {
          this.controlPlayer();
        }

        this.controlBalls();
        if (!this.gameFinishing) {
          this.detectCollision();
          if (this.isGameFinished()) {
            this.gameFinishing = true;
            this.gameOver();
          }
        }

        this.hudMgr.blink();
    }

    controlPlayer() {
        const b = balls[0];
        if (b.state == BALLSTATE_GROW) {
          b.grow();
        } else if (b.state == BALLSTATE_IDLE) {
          b.idle();
        } else if (b.state == BALLSTATE_SHRINK) {
          b.shrink();
        }
    }

    controlBalls() {
      for (var i = 1; i <= noOfBalls; i++) {
        const b = balls[i];
        if (b.state == BALLSTATE_MOVE) {
          b.move();
        } else if (b.state == BALLSTATE_GROW) {
          b.grow();
        } else if (b.state == BALLSTATE_IDLE) {
          b.idle();
        } else if (b.state == BALLSTATE_SHRINK) {
          b.shrink();
        }
      }
    }

    fire(evt) {
      if (this.collisionDetectionEnabled) {
        return;
      }

      this.input.on('pointerdown', function() {} , this);

      sndFire.play();
      const player = balls[0];
      player.state = BALLSTATE_GROW;
      player.x = evt.position.x;
      player.y = evt.position.y;
      player.radius = 1;
      player.add(this);

      this.collisionDetectionEnabled = true;
    }

    detectCollision() {
      if (!this.collisionDetectionEnabled) {
        return;
      }

      for (var idx = 1; idx <= noOfBalls; idx++) {
        const ball = balls[idx];
        if (ball.state != BALLSTATE_MOVE || ball.parentBall != null) {
          continue;
        }

        for (var i = 0; i <= noOfBalls; i++) {
          if (i == idx) {
            continue;
          }

          const tgt = balls[i];
          if (tgt.state == BALLSTATE_DEAD || tgt.state == BALLSTATE_MOVE) {
            continue;
          }

          if (!this.isInRange(tgt, ball)) {
            continue;
          }

          ball.state = BALLSTATE_GROW;
          ball.parentBall = tgt;
          ball.chainDepth = 1;

          var tmp = ball.parentBall;
          while (tmp.parentBall != null) {
            ball.chainDepth++;
            tmp = tmp.parentBall;
          }

          if (ball.chainDepth > longestChain) {
            longestChain = ball.chainDepth;
          }

          var z = ball.chainDepth + 1;
          var sc = (z * z * z) * 100;
          if (balls[0].state == BALLSTATE_DEAD) {
            sc += sc / 2;
          }

          goal--;
          roundScore += sc;

          this.addBounceScore(ball, sc);
          this.hudMgr.update();
          var snd = this.sound.add('explosion');
          snd.play();
        }
      }
    }

    isInRange(lhs, rhs) {
      const x = lhs.x - rhs.x
      const y = lhs.y - rhs.y
      let l = Math.sqrt((x * x) + (y * y))
      return (l - lhs.radius - rhs.radius) <= 0.0
    }

    addBounceScore(ball, score) {
      let lbl = this.add.text(ball.x, ball.y, '' + score, BALL_FONT);
      lbl.depth = ball.depth + 1000;
      lbl.setColor(COLOR_WHITE);
      lbl.setOrigin(0.5, 0.5);

      this.tweens.add({
        targets: lbl, 
        ease: 'Expo.out',
        props: {
          y: { value: '-=' + 100},
        }, 
        yoyo: false, 
        repeat: 0,
        duration: 1000,
      }, this);

      const tw = this.tweens.add({
        targets: lbl,
        alpha: 0,
        duration: 1000,
        ease: 'Power2'
      }, this);

      tw.on('complete', () => { lbl.destroy(); });
    }

    isGameFinished() {
      if (balls[0].state != BALLSTATE_DEAD) {
        return false;
      }
        
      for (var idx = 1; idx <= noOfBalls; idx++) {
        let ball = balls[idx];
        if (ball.state == BALLSTATE_IDLE ||
            ball.state == BALLSTATE_GROW ||
            ball.state == BALLSTATE_SHRINK) {
          return false;
        }
      }

      return true;
    }

    gameOver() {
      roundChainBonus = CHAIN_BONUS * longestChain * gdRound;
        
      if (goal > 0) {
        sndNay.play();
        penalty = (gdTotal + roundScore + roundChainBonus) / 2;
        if (penalty < gdTotal) {
          gdTotal -= penalty;
        } else {
          gdTotal = 0;
        }

        saveSession();
        this.switchToInterlude(INTERLUDE_ROUND_FAILED, 'game');
        return;
      }
        
      gdTotal += roundScore;
      gdTotal += roundChainBonus;
      newHiScore = gdTotal > gdHiScore;
      if (newHiScore) {
        gdHiScore = gdTotal;
        saveHiScore();
      }

      gdRound++;

      if (gdRound < rounds.length) {
        sndYay.play();
        saveSession();
        this.switchToInterlude(INTERLUDE_ROUND_COMPLETED, 'game');
        return;
      }
        
      sndMissionAccomplished.play();
        
      saveSession();
      this.switchToInterlude(INTERLUDE_MISSION_ACCOMPLISHED, 'intro');
    }

    switchToInterlude(interlude, nextScene) {
      this.cameras.main.fadeOut(250, 0, 0, 0);
	    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        setupInterlude(interlude, nextScene);
        this.scene.start('interlude')
      });
    }
}