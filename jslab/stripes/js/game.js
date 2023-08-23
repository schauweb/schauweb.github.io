let game = new Phaser.Game({
  width: 800,
  height: 480, 
  backgroundColor: '#000', 
  physics: { default: 'arcade' },
  parent: 'game', 
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 480,
    },
    max: {
      width: 800,
      height: 480,
    },
  },
});

game.scene.add('stripes', Stripes);
game.scene.start('stripes');
