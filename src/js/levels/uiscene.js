import Phaser from "phaser";

// Images
import playerImg from "@/assets/player.png";
import heartImg from "@/assets/heart.png";
import bulletImg from "@/assets/bullet.png";
import playerBulletImg from "@/assets/player-bullet.png";
import spaceBg from "@/assets/space.png";

// Classes
import Player from "@/js/classes/player.js";

// Sounds
import explosionSoundFile from "@/assets/sounds/explosion.wav";
import shootSoundFile from "@/assets/sounds/shoot.wav";
import impactScreamFile from "@/assets/sounds/impact-scream.wav";

// Sprites
import player1ExplosionSprite from "@/assets/player-1-explosion-sprite.png";

// Upgrades
import x2UpgradeImg from "@/assets/upgrades/x2.png";

class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");

    this.gameSettings = {
      playerSpeed: 330,
      playerWeapon: "bullets",
      playerHealth: 3,
    };
  }

  preload() {
    this.registry.set("gameSettings", this.gameSettings);

    this.config = this.sys.game.config;

    let text = this.add
      .text(0, 0, "Loading...", {
        fontFamily: '"Arial Black", "Arial Bold", "Arial", sans-serif',
        fontSize: "34px",
        fill: "#fff",
      })
      .setOrigin(0.5, 0.5)
      .setPosition(this.config.width / 2, this.config.height / 2);

    this.load.image("player", playerImg);
    this.load.image("heart", heartImg);
    this.load.image("bullet", bulletImg);
    this.load.image("playerBullet", playerBulletImg);

    // TODO: Import calm / space-ish music here

    this.load.image("space", spaceBg);
    this.load.image("x2Upgrade", x2UpgradeImg);
    this.load.audio("explosionSound", explosionSoundFile);
    this.load.audio("shootSound", shootSoundFile);
    this.load.audio("impactScreamSound", impactScreamFile);

    this.load.spritesheet("player-1-explosion", player1ExplosionSprite, {
      frameWidth: 230,
      frameHeight: 125,
      endFrame: 9,
    });
  }

  create() {
    this.sound.volume = 0.4;
    this.bg = this.add.tileSprite(0, 0, 1500, 900, "space");
    this.bg.setOrigin(0, 0);

    this.player = new Player(
      this,
      this.config.width / 2,
      this.config.height - 150,
      this.gameSettings.playerSpeed,
      this.gameSettings.playerWeapon,
      this.gameSettings.playerHealth
    );
    this.registry.set("player", this.player);

    /*
     * MISC SPRITES
     */
    this.cursors = this.input.keyboard.createCursorKeys();

    this.playerBullets = this.physics.add.group();
    this.registry.set("playerBullets", this.playerBullets);

    this.alienBullets = this.physics.add.group();
    this.registry.set("alienBullets", this.alienBullets);

    this.aliens = this.physics.add.group();
    this.registry.set("aliens", this.aliens);

    /*
     * UPGRADES
     */

    this.upgrades = this.physics.add.group();
    this.registry.set("upgrades", this.upgrades);

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

    // When the player picks up an upgrade
    this.physics.add.overlap(
      this.player.sprite,
      this.upgrades,
      function (playerSprite, upgrade) {
        upgrade.enable(playerSprite.player);
        upgrade.destroy();

        this.time.delayedCall(
          3500,
          function () {
            upgrade.expire(playerSprite.player);
          },
          [],
          this
        );
      },
      null,
      this
    );

    // When the player is hit by an alien bullet
    this.physics.add.overlap(
      this.player.sprite,
      this.alienBullets,
      function (playerSprite, alienBullet) {
        // Can't hit a player who was just hit
        if (this.player.indestructible) return;

        this.player.decreaseLife(1);
        alienBullet.destroy();
        this.sound.play("impactScreamSound");

        if (this.player.health > 0) return;

        this.player.destroy();

        let youLoseText = this.add
          .text(0, 0, "You lose", {
            fontFamily: '"Arial Black", "Arial Bold", "Arial", sans-serif',
            fontSize: "64px",
            fill: "#fff",
          })
          .setOrigin(0.5, 0.5)
          .setPosition(this.config.width / 2, this.config.height / 2)
          .setVisible(false);

        let spaceToRestartText = this.add
          .text(0, 0, "Hit <Space> to restart", {
            fontFamily: '"Arial Black", "Arial Bold", "Arial", sans-serif',
            fontSize: "34px",
            fill: "#fff",
          })
          .setOrigin(0.5, 0.5)
          .setPosition(this.config.width / 2, this.config.height / 2 + 100)
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
          2100,
          function () {
            spaceToRestartText.setVisible(true);
            this.allowRestart = true;
          },
          [],
          this
        );
      },
      null,
      this
    );

    //  Launch
    this.scene.launch("Level1");
  }

  update() {
    // Move using the arrow keys
    if (this.player.sprite.active) {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-this.player.speed);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.player.speed);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(this.player.speed);
      } else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-this.player.speed);
      } else {
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
      }
    }

    // Shoot using the space bar
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      if (this.player.sprite.active) {
        if (this.player.weapon === "bullets") {
          this.playerBullet = this.playerBullets.create(
            this.player.sprite.x,
            this.player.sprite.y - this.player.sprite.height + 40,
            "playerBullet"
          );
          this.playerBullet.setVelocityY(-this.player.speed);
          this.sound.play("shootSound");
        } else if (this.player.weapon === "double-bullets") {
          this.playerBullet1 = this.playerBullets.create(
            this.player.sprite.x - 20,
            this.player.sprite.y - this.player.sprite.height + 40,
            "playerBullet"
          );
          this.playerBullet1.setVelocityY(-this.player.speed);
          this.playerBullet2 = this.playerBullets.create(
            this.player.sprite.x + 20,
            this.player.sprite.y - this.player.sprite.height + 40,
            "playerBullet"
          );
          this.playerBullet2.setVelocityY(-this.player.speed);
          this.sound.play("shootSound");
        }
      } else {
        if (this.allowRestart) {
          // Restart the game
          this.allowRestart = false;
          this.scene.restart();
        }
      }
    }

    // Move the texture of the tile sprite upwards
    this.bg.tilePositionY -= 1.2;
  }
}

export default UIScene;
