/*
 * ALIENS
 */
class Alien extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    texture,
    shootDelay,
    movementSpeed,
    spawning,
    alienBullets
  ) {
    super(scene, 0, 0, texture);
    this.scene = scene;
    this.shootDelay = shootDelay;
    this.movementSpeed = movementSpeed;
    this.alienBullets = alienBullets;
    this.spawning = spawning;
    // Add this to the physics system
    this.scene.physics.world.enable(this);
    // Initialize shooting and moving
    if (!this.spawning) {
      this.startShooting();
    }
    if (!this.spawning) this.startMoving();

    this.upgrades = this.scene.registry.get("upgrades");
    this.gameSettings = this.scene.registry.get("gameSettings");
  }

  kill() {
    if (this.nextShootEvent) this.nextShootEvent.remove();
    this.scene.sound.play("explosionSound");
    this.destroy();
    this.dropUpgrade(80);
  }

  setup(x, y) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    //this.setCollideWorldBounds(true); TOOD: implement
  }

  dropUpgrade(probability) {
    this.upgradeTypes = {
      x2: () => {
        let upgrade = this.upgrades.create(this.x, this.y, "x2Upgrade");
        upgrade.enable = (player) => {
          player.setSpeed(this.gameSettings.playerSpeed * 1.5);
          player.setWeapons("double-bullets");
        };
        upgrade.expire = (player) => {
          player.setSpeed(this.gameSettings.playerSpeed);
          player.setWeapons("bullets");
        };
        upgrade.setVelocityY(200);
      },
    };

    // Drop an upgrade
    let dropUpgradeChance = Phaser.Math.Between(0, 100);
    if (dropUpgradeChance > probability) {
      this.upgradeTypes.x2();
    }
  }

  startShooting() {
    let shoot = () => {
      let bullet = this.alienBullets.create(
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
    let initialDelay = Phaser.Math.Between(0, this.shootDelay * 1.65);
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

      let targets;
      if (this.healthBar) {
        targets = [this, this.healthBar.bar];
      } else {
        targets = [this];
      }

      // Create a tween that changes the x position of the alien
      this.scene.tweens.add({
        targets: targets,
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

export default Alien;
