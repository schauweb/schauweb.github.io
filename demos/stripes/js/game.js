const screen_w = document.body.clientWidth;
const dpr = window.devicePixelRatio;

let game = new Phaser.Game({
  width: screen_w,
  height: 480 * dpr,
  backgroundColor: '#000',
  physics: { default: 'arcade' },
  parent: 'game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: screen_w,
      height: 480 * dpr,
    },
    max: {
      width: screen_w,
      height: 480 * dpr,
    },
  },
});

game.scene.add('stripes', Stripes);
game.scene.start('stripes');
