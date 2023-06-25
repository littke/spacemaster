import Phaser from "phaser";

import playerImg from "./assets/player.png";
import bulletImg from "./assets/bullet.png";
import alienImg from "./assets/alien.png";
import spaceBg from "./assets/space.png";
import explosionSoundFile from "./assets/sounds/explosion.wav";
import shootSoundFile from "./assets/sounds/shoot.wav";

const config = {
  type: Phaser.AUTO,
  width: 1400,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

let player;
let cursors;
let bullets;
let aliens;
let bg;
let explosionSound;
let shootSound;

function preload() {
  this.load.image("player", playerImg);
  this.load.image("bullet", bulletImg);
  this.load.image("alien", alienImg);
  this.load.image("space", spaceBg);
  this.load.audio("explosionSound", explosionSoundFile);
  this.load.audio("shootSound", shootSoundFile);
}

function create() {
  // Create a stars background
  bg = this.add.tileSprite(0, 0, 1400, 600, "space");
  bg.setOrigin(0, 0);

  player = this.physics.add.sprite(
    config.width / 2,
    config.height - 50,
    "player"
  );
  cursors = this.input.keyboard.createCursorKeys();
  bullets = this.physics.add.group();
  aliens = this.physics.add.group({
    key: "alien",
    repeat: 10,
    setXY: { x: 100, y: 100, stepX: 115 },
  });

  aliens.getChildren().forEach((alien) => {
    let shoot = () => {
      let bullet = bullets.create(
        alien.x,
        alien.y + alien.height - 30,
        "bullet"
      );
      bullet.setVelocityY(300);

      if (alien.active) {
        let delay = Phaser.Math.Between(200, 3500); // random delay between 200ms and 2000ms
        alien.nextShootEvent = this.time.delayedCall(delay, shoot, [], this);
      }
    };

    // Add an initial delay before the first shot
    let initialDelay = Phaser.Math.Between(0, 4000);
    alien.nextShootEvent = this.time.delayedCall(initialDelay, shoot, [], this);
  });

  // Add audio
  explosionSound = this.sound.add("explosionSound");
  shootSound = this.sound.add("shootSound");

  // Handle overlaps
  this.physics.add.overlap(
    bullets,
    aliens,
    function (bullet, alien) {
      bullet.destroy();
      explosionSound.play();
      if (alien.nextShootEvent) {
        alien.nextShootEvent.remove();
      }
      alien.destroy();
    },
    null,
    this
  );

  this.physics.add.overlap(
    player,
    bullets,
    function (bullet, alien) {
      bullet.destroy();
      alert("You died");
    },
    null,
    this
  );
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-350);
  } else if (cursors.right.isDown) {
    player.setVelocityX(350);
  } else {
    player.setVelocityX(0);
  }

  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    let bullet = bullets.create(
      player.x,
      player.y - player.height + 40,
      "bullet"
    );
    bullet.setVelocityY(-250);
    shootSound.play();
  }

  // Move the texture of the tile sprite upwards
  bg.tilePositionY -= 1.1;
}
