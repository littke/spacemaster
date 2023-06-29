import Phaser from "phaser";

// Images
import playerImg from "./assets/player.png";
import bulletImg from "./assets/bullet.png";
import playerBulletImg from "./assets/player-bullet.png";
import alienImg from "./assets/alien.png";
import bossAlienImg from "./assets/boss-alien.png";
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

let gameSettings = {
  playerSpeed: 330,
  playerWeapon: "bullets",
  regularAliens: 11,
};

let game = new Phaser.Game(config);

let player;
let cursors;
let alienBullets;
let playerBullets;
let upgrades;
let bg;
let explosionSound;
let shootSound;
let playerDeadSound;
let level1Music;
let showBoss = false;
let bossAlien;
let params = new URLSearchParams(window.location.search);

function preload() {
  this.load.image("player", playerImg);
  this.load.image("bullet", bulletImg);
  this.load.image("playerBullet", playerBulletImg);
  this.load.image("alien", alienImg);
  this.load.image("bossAlien", bossAlienImg);
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
  /*
   * SCENE
   */
  bg = this.add.tileSprite(0, 0, 1500, 900, "space");
  bg.setOrigin(0, 0);

  /*
   * PLAYER
   */
  player = this.physics.add.sprite(
    config.width / 2,
    config.height - 150,
    "player"
  );
  player.setSpeed = (speed) => {
    player.speed = speed;
  };
  player.setWeapons = (weapon) => {
    player.weapon = weapon;
  };
  player.speed = gameSettings.playerSpeed;
  player.weapon = gameSettings.playerWeapon;
  player.setCollideWorldBounds(true); // keeps the player within the game world

  /*
   * MISC SPRITES
   */
  cursors = this.input.keyboard.createCursorKeys();
  alienBullets = this.physics.add.group();
  playerBullets = this.physics.add.group();

  /*
   * ALIENS
   */
  class Alien extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, shootDelay, movementSpeed) {
      super(scene, 0, 0, texture);
      this.scene = scene;
      this.shootDelay = shootDelay;
      this.movementSpeed = movementSpeed;
      // Add this to the physics system
      this.scene.physics.world.enable(this);
      // Initialize shooting and moving
      if (params.get("noAlienShooting") !== "true") {
        this.startShooting();
      }
      this.startMoving();

      this.dropUpgrade = {
        x2: () => {
          let upgrade = upgrades.create(this.x, this.y, "x2Upgrade");
          upgrade.enable = (player) => {
            player.setSpeed(gameSettings.playerSpeed * 2);
            player.setWeapons("double-bullets");
          };
          upgrade.expire = (player) => {
            player.setSpeed(gameSettings.playerSpeed);
            player.setWeapons("bullets");
          };
          upgrade.setVelocityY(200);
        },
      };
    }

    setup(x, y) {
      this.setPosition(x, y);
      this.setActive(true);
      this.setVisible(true);
    }

    startShooting() {
      let shoot = () => {
        let bullet = alienBullets.create(
          this.x,
          this.y + this.height / 2,
          "bullet"
        );
        bullet.setVelocityY(300);

        if (this.active) {
          this.nextShootEvent = this.scene.time.delayedCall(
            Phaser.Math.Between(350, this.shootDelay),
            shoot,
            [],
            this
          );
        }
      };

      // Add an initial delay before the first shot
      let initialDelay = Phaser.Math.Between(0, this.shootDelay);
      this.nextShootEvent = this.scene.time.delayedCall(
        initialDelay,
        shoot,
        [],
        this
      );
    }

    startMoving() {
      let move = () => {
        if (!this.active) return;

        let direction = Phaser.Math.Between(-1, 1);
        let distance = Phaser.Math.Between(0, 100);

        // calculate the target x position
        let target = this.x + direction * distance;
        if (target > this.scene.game.config.width - this.width || target < 0) {
          target = this.x;
        }

        // Create a tween that changes the x position of the alien
        this.scene.tweens.add({
          targets: this,
          x: target,
          duration: this.movementSpeed, // random duration between 500ms and 1500ms
          ease: "Linear", // use linear easing
          onComplete: this.active ? move : null, // call this function again once the tween completes
        });
      };

      let movementDelay = Phaser.Math.Between(0, this.movementSpeed);
      this.nextMoveEvent = this.scene.time.delayedCall(
        movementDelay,
        move,
        [],
        this
      );
    }
  }

  class RegularAlien extends Alien {
    constructor(scene) {
      super(scene, "alien", 3900, 1000);
    }
  }

  class BossAlien extends Alien {
    constructor(scene) {
      super(scene, "bossAlien", 1300, 400);
      this.setLife(10); // Extra life
    }

    setLife(value) {
      this.life = value;
    }
  }

  // Create the aliens
  let regularAliens = this.physics.add.group({
    classType: RegularAlien,
  });

  for (let i = 0; i < gameSettings.regularAliens; i++) {
    let alien = regularAliens.get();
    alien.setup(100 + 130 * i, 100);
  }

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

  /*
   *
   * DEVELOPMENT TOOLS
   *
   * Enable these as query strings when needed
   * *
   */

  // Add music, unless the user said they don't want it
  if (params.get("noMusic") !== "true") {
    if (!level1Music) {
      level1Music = this.sound.add("level1Music");
      level1Music.setVolume(0.8);
      level1Music.play();
    }
  }

  if (params.get("dropUpgrades") === "true") {
    regularAliens.getChildren()[5].dropUpgrade.x2();
  }

  /*
   * ANIMATIONS
   */

  // Add animations
  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("player-1-explosion", {
      start: 0,
      end: 8,
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
    regularAliens,
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

      // Let's see if all regular aliens are dead
      let aliensAlive = false;
      regularAliens.getChildren().forEach((alien) => {
        if (alien.active) {
          aliensAlive = true;
        }
      });
      if (aliensAlive === false && player.active) {
        if (!showBoss) {
          showBoss = true;

          let bossAlienGroup = this.physics.add.group({ classType: BossAlien });
          bossAlien = bossAlienGroup.get();
          bossAlien.setup(config.width / 2, 170);

          // If the player hits the boss alien
          this.physics.add.overlap(
            bossAlien,
            playerBullets,
            function (bossAlien, playerBullet) {
              playerBullet.destroy();
              bossAlien.setLife(bossAlien.life - 1);

              if (bossAlien.life === 0 && player.active) {
                bossAlien.destroy();

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
        }
      }
    },
    null,
    this
  );

  // When the player is hit by an alien bullet
  this.physics.add.overlap(
    player,
    alienBullets,
    function (player, alienBullet) {
      alienBullet.destroy();
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
      upgrade.enable(player);
      upgrade.destroy();

      this.time.delayedCall(
        3000,
        function () {
          upgrade.expire(player);
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
      if (player.weapon === "bullets") {
        let playerBullet = playerBullets.create(
          player.x,
          player.y - player.height + 40,
          "playerBullet"
        );
        playerBullet.setVelocityY(-player.speed);
        shootSound.play();
      } else if (player.weapon === "double-bullets") {
        let playerBullet1 = playerBullets.create(
          player.x - 20,
          player.y - player.height + 40,
          "playerBullet"
        );
        playerBullet1.setVelocityY(-player.speed);
        let playerBullet2 = playerBullets.create(
          player.x + 20,
          player.y - player.height + 40,
          "playerBullet"
        );
        playerBullet2.setVelocityY(-player.speed);
        shootSound.play();
      }
    } else {
      // Restart the game
      this.scene.restart();
    }
  }

  // Move the texture of the tile sprite upwards
  bg.tilePositionY -= 1.1;
}
