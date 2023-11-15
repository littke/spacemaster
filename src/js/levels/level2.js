import Phaser from "phaser";

// Images
import bossAlienImg from "@/assets/boss-alien.png";
import bossAlienBulletImg from "@/assets/boss-alien-bullet.png";

// Classes
import HealthBar from "@/js/classes/healthbar.js";
import Alien from "@/js/classes/alien.js";

// Sprites
import bossAlienExplosionSprite from "@/assets/boss-alien-explosion-sprite.png";

class Level2 extends Phaser.Scene {
  constructor() {
    super("Level2");
    let bossAlien;
  }

  preload() {
    this.load.image("bossAlien", bossAlienImg);
    this.load.image("bossAlienBullet", bossAlienBulletImg);

    this.load.spritesheet("boss-alien-explosion", bossAlienExplosionSprite, {
      frameWidth: 600,
      frameHeight: 420,
      endFrame: 10,
    });
  }

  create() {
    this.anims.create({
      key: "bossAlienExplode",
      frames: this.anims.generateFrameNumbers("boss-alien-explosion", {
        start: 0,
        end: 10,
        first: 0,
      }),
      frameRate: 23,
      repeat: 0,
      hideOnComplete: true,
    });

    this.player = this.registry.get("player");
    this.playerBullets = this.registry.get("playerBullets");
    this.alienBullets = this.registry.get("alienBullets");
    this.config = this.sys.game.config;

    class BossAlien extends Alien {
      constructor(scene, alienBullets) {
        super(scene, "bossAlien", 1800, 400, true, scene.alienBullets);
        this.life = 20;
        this.healthBar = new HealthBar(
          this.scene,
          this.x - 41,
          this.y + 40,
          this.life
        );
      }

      // Set the starting position of the boss alien
      setup(x, y) {
        this.setPosition(x, -100);
        this.spawning = true;
        // move the bossalien into position
        this.scene.tweens.add({
          targets: this,
          y: y,
          duration: 1300,
          ease: "Linear", // use linear easing
          onComplete: () => {
            this.startMoving();
            this.startShooting();
            this.spawning = false;
          },
        });

        this.setActive(true);
        this.setVisible(true);
      }

      kill() {
        this.healthBar.bar.destroy();
        this.scene.physics.add
          .sprite(this.x, this.y, "bossAlienExplode")
          .play("bossAlienExplode");
        this.scene.sound.play("explosionSound");
        this.destroy();
      }

      setLife(value) {
        this.healthBar.decrease(this.life - value);
        this.life = value;
      }

      startShooting() {
        let shoot = () => {
          if (!this.active) return;

          let bossAlienBullet = this.alienBullets.create(
            this.x,
            this.y + this.height / 2 - 70,
            "bossAlienBullet"
          );

          // Determine the angle towards the target
          let angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.scene.player.sprite.x,
            this.scene.player.sprite.y
          );

          // Determine the speed of movement
          let speed = 350;

          // Determine the x and y velocities
          let velocityX = speed * Math.cos(angle);
          let velocityY = speed * Math.sin(angle);

          // Set these velocities
          bossAlienBullet.setVelocity(velocityX, velocityY);

          if (this.active) {
            this.nextShootEvent = this.scene.time.delayedCall(
              Phaser.Math.Between(270, this.shootDelay),
              shoot,
              [],
              this
            );
          }
        };

        shoot();
      }
    }

    this.bossAlienGroup = this.physics.add.group({ classType: BossAlien });
    this.bossAlien = this.bossAlienGroup.get();
    this.bossAlien.setup(this.config.width / 2, 170, this.alienBullets);

    // If the player hits the boss alien
    this.physics.add.overlap(
      this.playerBullets,
      this.bossAlienGroup,
      function (playerBullet, bossAlien) {
        playerBullet.destroy();

        // Don't allow shooting the boss while it's spawning
        if (bossAlien.spawning) return;
        bossAlien.setLife(bossAlien.life - 1);

        if (this.bossAlien.life === 0 && this.player.sprite.active) {
          bossAlien.kill();

          // Show "You win" text
          let text = this.add
            .text(0, 0, "You win!", {
              fontFamily: '"Arial Black", "Arial Bold", "Arial", sans-serif',
              fontSize: "64px",
              fill: "#fff",
            })
            .setOrigin(0.5, 0.5)
            .setPosition(this.config.width / 2, this.config.height / 2)
            .setVisible(false);

          this.time.delayedCall(
            900,
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

  update() {}
}

export default Level2;
