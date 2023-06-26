import Phaser from "phaser";

// Images
import playerImg from "./assets/player.png";
import bulletImg from "./assets/bullet.png";
import playerBulletImg from "./assets/player-bullet.png";
import alienImg from "./assets/alien.png";
import spaceBg from "./assets/space.png";

// Sounds
import explosionSoundFile from "./assets/sounds/explosion.wav";
import shootSoundFile from "./assets/sounds/shoot.wav";
import impactScreamFile from "./assets/sounds/impact-scream.wav";

// Music
import music1File from "./assets/music/172_drum_n_bass_regal_heavy_electronic_drums.wav";

// Sprites
import player1ExplosionSprite from "./assets/player-1-explosion-sprite.png";

// Upgrades
import x2UpgradeImg from "./assets/upgrades/x2.png";

const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 900,
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
let playerBullets;
let aliens;
let upgrades;
let bg;
let explosionSound;
let shootSound;
let playerDeadSound;
let level1Music;

let gameSettings = {
  playerSpeed: 330,
};

function preload() {
  this.load.image("player", playerImg);
  this.load.image("bullet", bulletImg);
  this.load.image("playerBullet", playerBulletImg);
  this.load.image("alien", alienImg);
  this.load.image("space", spaceBg);
  this.load.image("x2Upgrade", x2UpgradeImg);
  this.load.audio("explosionSound", explosionSoundFile);
  this.load.audio("shootSound", shootSoundFile);
  this.load.audio("impactScreamSound", impactScreamFile);
  this.load.audio("level1Music", music1File);
  this.load.spritesheet("player-1-explosion", player1ExplosionSprite, {
    frameWidth: 230,
    frameHeight: 125,
    endFrame: 9,
  });
}

function create() {
  // Create a stars background
  bg = this.add.tileSprite(0, 0, 1500, 900, "space");
  bg.setOrigin(0, 0);

  player = this.physics.add.sprite(
    config.width / 2,
    config.height - 150,
    "player"
  );
  player.setSpeed = (speed) => {
    player.speed = speed;
  };
  player.speed = gameSettings.playerSpeed;
  player.setCollideWorldBounds(true); // keeps the player within the game world

  cursors = this.input.keyboard.createCursorKeys();
  bullets = this.physics.add.group();
  playerBullets = this.physics.add.group();

  /*
   * ALIENS
   */
  aliens = this.physics.add.group({
    key: "alien",
    repeat: 10,
    setXY: { x: 100, y: 100, stepX: 130 },
  });

  aliens.getChildren().forEach((alien) => {
    alien.dropUpgrade = {
      x2: () => {
        let upgrade = upgrades.create(alien.x, alien.y, "x2Upgrade");
        upgrade.setVelocityY(200);
      },
    };

    let shoot = () => {
      let bullet = bullets.create(
        alien.x,
        alien.y + alien.height - 30,
        "bullet"
      );
      bullet.setVelocityY(300);

      if (alien.active) {
        let delay = Phaser.Math.Between(300, 4100); // random delay
        alien.nextShootEvent = this.time.delayedCall(delay, shoot, [], this);
      }
    };

    let move = () => {
      let direction = Phaser.Math.Between(-1, 1);
      let distance = Phaser.Math.Between(0, 100);

      // calculate the target x position
      let target = alien.x + direction * distance;
      if (target > config.width - alien.width || target < 0) {
        target = alien.x;
      }

      // Create a tween that changes the x position of the alien
      this.tweens.add({
        targets: alien,
        x: target,
        duration: Phaser.Math.Between(500, 1500), // random duration between 500ms and 1500ms
        ease: "Linear", // use linear easing
        onComplete: alien.active ? move : null, // call this function again once the tween completes
      });
    };

    let movementDelay = Phaser.Math.Between(0, 3000);
    alien.nextMoveEvent = this.time.delayedCall(movementDelay, move, [], this);

    // Add an initial delay before the first shot
    let initialDelay = Phaser.Math.Between(0, 4500);
    alien.nextShootEvent = this.time.delayedCall(initialDelay, shoot, [], this);
  });

  /*
   * UPGRADES
   */

  upgrades = this.physics.add.group();

  /*
   * SOUNDS
   */
  explosionSound = this.sound.add("explosionSound");
  shootSound = this.sound.add("shootSound");
  playerDeadSound = this.sound.add("impactScreamSound");

  // Add music, unless the user said they don't want it
  let params = new URLSearchParams(window.location.search);
  if (params.get("noMusic") !== "true") {
    if (!level1Music) {
      level1Music = this.sound.add("level1Music");
      level1Music.setVolume(0.8);
      level1Music.play();
    }
  }

  // Add animations
  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("player-1-explosion", {
      start: 0,
      end: 9,
      first: 0,
    }),
    frameRate: 23,
    repeat: 0,
    hideOnComplete: true,
  });

  /*
   * OVERLAPS
   */

  // When a player bullet hits an alien
  this.physics.add.overlap(
    playerBullets,
    aliens,
    function (playerBullet, alien) {
      playerBullet.destroy();
      explosionSound.play();
      if (alien.nextShootEvent) {
        alien.nextShootEvent.remove();
      }
      alien.destroy();

      // Drop an upgrade
      let dropUpgradeChance = Phaser.Math.Between(0, 100);
      if (dropUpgradeChance > 80) {
        alien.dropUpgrade.x2();
      }

      // Let's see if it's game over
      let aliensAlive = false;
      if (
        aliens.getChildren().forEach((alien) => {
          if (alien.active) {
            aliensAlive = true;
          }
        })
      );
      if (aliensAlive == false) {
        // Show "You win" text
        let text = this.add
          .text(0, 0, "You win!", {
            font: '64px "Arial Black"',
            fill: "#fff",
          })
          .setOrigin(0.5, 0.5)
          .setPosition(config.width / 2, config.height / 2)
          .setVisible(false);

        this.time.delayedCall(
          600,
          function () {
            text.setVisible(true); // after 300ms, the text becomes visible
          },
          [],
          this
        );
      }
    },
    null,
    this
  );

  // When the player is hit by an alien bullet
  this.physics.add.overlap(
    player,
    bullets,
    function (bullet, alien) {
      bullet.destroy();
      let explosion = this.physics.add.sprite(player.x, player.y, "explosion");
      explosion.play("explode");
      playerDeadSound.play();
      player.destroy();

      let youLoseText = this.add
        .text(0, 0, "You lose", {
          font: '64px "Arial Black"',
          fill: "#fff",
        })
        .setOrigin(0.5, 0.5)
        .setPosition(config.width / 2, config.height / 2)
        .setVisible(false);

      let spaceToRestartText = this.add
        .text(0, 0, "Hit <Space> to restart", {
          font: '34px "Arial Black"',
          fill: "#fff",
        })
        .setOrigin(0.5, 0.5)
        .setPosition(config.width / 2, config.height / 2 + 100)
        .setVisible(false);

      this.time.delayedCall(
        600,
        function () {
          youLoseText.setVisible(true);
        },
        [],
        this
      );
      this.time.delayedCall(
        1800,
        function () {
          spaceToRestartText.setVisible(true);
        },
        [],
        this
      );
    },
    null,
    this
  );

  // When the player picks up an upgrade
  this.physics.add.overlap(
    player,
    upgrades,
    function (player, upgrade) {
      upgrade.destroy();
      player.setSpeed(gameSettings.playerSpeed * 2);

      this.time.delayedCall(
        3000,
        function () {
          player.setSpeed(gameSettings.playerSpeed);
        },
        [],
        this
      );
    },
    null,
    this
  );
}

function update() {
  if (player.active) {
    if (cursors.left.isDown) {
      player.setVelocityX(-player.speed);
    } else if (cursors.right.isDown) {
      player.setVelocityX(player.speed);
    } else if (cursors.down.isDown) {
      player.setVelocityY(player.speed);
    } else if (cursors.up.isDown) {
      player.setVelocityY(-player.speed);
    } else {
      player.setVelocityX(0);
      player.setVelocityY(0);
    }
  }

  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    if (player.active) {
      let playerBullet = playerBullets.create(
        player.x,
        player.y - player.height + 40,
        "playerBullet"
      );
      playerBullet.setVelocityY(-player.speed);
      shootSound.play();
    } else {
      // Restart the game
      this.scene.restart();
    }
  }

  // Move the texture of the tile sprite upwards
  bg.tilePositionY -= 1.1;
}
