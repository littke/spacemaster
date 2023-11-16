import Alien from "@/js/classes/alien.js";
import HealthBar from "@/js/classes/healthbar.js";

// Images
import bossAlienImg from "@/assets/boss-alien.png";
import bossAlienBulletImg from "@/assets/boss-alien-bullet.png";

// Sprites
import bossAlienExplosionSprite from "@/assets/boss-alien-explosion-sprite.png";

class BossAlien extends Alien {
  constructor(scene) {
    super(scene, "bossAlien", 1800, 400, true, scene.alienBullets);
    this.life = 20;
    this.healthBar = new HealthBar(
      this.scene,
      this.x - 41,
      this.y + 40,
      this.life
    );

    // If the player hits the boss alien, don't kill it, just reduce health
    scene.physics.add.overlap(
      scene.playerBullets,
      scene.bossAlienGroup,
      function (playerBullet, bossAlien) {
        playerBullet.destroy();

        // Don't allow shooting the boss while it's spawning
        if (bossAlien.spawning) return;
        bossAlien.setLife(bossAlien.life - 1);

        if (this.life === 0 && scene.player.sprite.active) {
          bossAlien.kill();
        }
      },
      null,
      this
    );
  }

  static preload(scene) {
    scene.load.image("bossAlien", bossAlienImg);
    scene.load.image("bossAlienBullet", bossAlienBulletImg);

    scene.load.spritesheet("boss-alien-explosion", bossAlienExplosionSprite, {
      frameWidth: 600,
      frameHeight: 420,
      endFrame: 10,
    });
  }

  static createAnimations(scene) {
    scene.anims.create({
      key: "bossAlienExplode",
      frames: scene.anims.generateFrameNumbers("boss-alien-explosion", {
        start: 0,
        end: 10,
        first: 0,
      }),
      frameRate: 23,
      repeat: 0,
      hideOnComplete: true,
    });
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
    this.scene.events.emit("bossAlienDied");
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

export default BossAlien;
