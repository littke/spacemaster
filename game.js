import Phaser from "phaser";

import playerImg from "./assets/player.png";
import bulletImg from "./assets/bullet.png";
import alienImg from "./assets/alien.png";

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

function preload() {
  this.load.image("player", playerImg);
  this.load.image("bullet", bulletImg);
  this.load.image("alien", alienImg);
}

function create() {
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
    let delay = Phaser.Math.Between(200, 7000); // random delay between 200ms and 2000ms
    alien.shootEvent = this.time.addEvent({
      delay: delay,
      callback: function () {
        let bullet = bullets.create(
          alien.x,
          alien.y + alien.height - 30,
          "bullet"
        );
        bullet.setVelocityY(250);
      },
      callbackScope: this,
      loop: true,
    });
  });

  this.physics.add.overlap(
    bullets,
    aliens,
    function (bullet, alien) {
      bullet.destroy();
      alien.shootEvent.remove(); // stop the alien from shooting
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
    player.setVelocityX(-300);
  } else if (cursors.right.isDown) {
    player.setVelocityX(300);
  } else {
    player.setVelocityX(0);
  }

  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    let bullet = bullets.create(player.x, player.y - player.height, "bullet");
    bullet.setVelocityY(-250);
  }
}
