let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let bird;
let cursors;
let pipes;
let score = 0;
let scoreText;
let gameOver = false;
let gameStarted = false;
let startText;
let gameOverText;
let game;

game = new Phaser.Game(config);

function preload () {
  this.load.image('background', 'assets/background.png');
  this.load.image('pipe', 'assets/colomn.png');
  this.load.image('germany', 'assets/germany.png');
  this.load.audio('bgmusic', 'assets/song.mp3');

}

function create () {
  this.add.image(400, 300, 'background').setScale(1.2);

  bird = this.physics.add.sprite(100, 100, 'germany').setScale(0.11); // initial Y is top-ish
bird.setCollideWorldBounds(true);
bird.setBounce(0.6); // This allows bouncing
bird.setVelocityY(100); // Start falling


  cursors = this.input.keyboard.createCursorKeys();

  pipes = this.physics.add.group();

  scoreText = this.add.text(16, 16, '', {
    fontSize: '32px',
    fill: '#fff'
  });

  startText = this.add.text(400, 300, 'Press ENTER to Capture Paris', {
    fontSize: '36px',
    fill: '#b00d0dff',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  gameOverText = this.add.text(400, 300, '', {
    fontSize: '36px',
    fill: '#ff0000',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  this.input.keyboard.on('keydown-ENTER', () => {
    if (!gameStarted) {
      startText.setVisible(false);
      bird.setVisible(true);
      gameStarted = true;
      scoreText.setText('Score: 0');

      this.time.addEvent({
        delay: 1500,
        callback: addRowOfPipes,
        callbackScope: this,
        loop: true
      });

      this.physics.add.overlap(bird, pipes, hitPipe, null, this);
    }
  });
  let musicStarted = false;
let music = this.sound.add('bgmusic', { loop: true, volume: 0.5 });

this.input.keyboard.on('keydown', function (event) {
  if (!musicStarted && (event.code === 'Enter' || event.code === 'Space')) {
    music.play();
    musicStarted = true;
  }
});


}

function update () {
  if (!gameStarted || gameOver) return;

  if (cursors.space.isDown) {
    bird.setVelocityY(-250);
  }

  if (bird.y > 600) {
    endGame.call(this);
  }
}

function addOnePipe(x, y) {
  let pipe = pipes.create(x, y, 'pipe');
  pipe.body.allowGravity = false;
  pipe.setVelocityX(-200);
}

function addRowOfPipes () {
  if (gameOver) return;

  let hole = Phaser.Math.Between(1, 5);

  for (let i = 0; i < 8; i++) {
    if (i !== hole && i !== hole + 1) {
      addOnePipe(800, i * 75 + 10);
    }
  }

  score += 1;
  scoreText.setText('Score: ' + score);
}

function hitPipe () {
  if (!gameOver) {
    endGame.call(this);
  }
}

function endGame () {
  gameOver = true;
 

  this.physics.pause();
  gameOverText.setText('War Over!\nFinal Killed Jews: ' + score  );

}
