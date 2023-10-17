import Hearts from "./hearts.js";

class Player {
  constructor(scene, x, y, playerSpeed, playerWeapon, playerHealth) {
    this.speed = playerSpeed;
    this.weapon = playerWeapon;
    this.health = playerHealth;
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, "player");
    this.sprite.setCollideWorldBounds(true); // keeps the player within the game world
    this.sprite.player = this;

    this.hearts = new Hearts(scene, 30, 830, this.health);
  }

  setSpeed = (speed) => {
    this.speed = speed;
  };

  setWeapons = (weapon) => {
    this.weapon = weapon;
  };

  setVelocityX = (velocity) => {
    this.sprite.setVelocityX(velocity);
  };

  setVelocityY = (velocity) => {
    this.sprite.setVelocityY(velocity);
  };

  decreaseLife(amount) {
    // When we're decreasing life, temporary blink and make the player indestructible
    // for a short period of time. This is to avoid the player being hit multiple times.
    if (!this.indestructible) {
      this.health -= amount;
      this.hearts.decrease(amount);
    }
    this.indestructible = true;

    this.sprite.scene.tweens.add({
      targets: this.sprite,
      alpha: { from: 1, to: 0 },
      duration: 100,
      repeat: 3,
      ease: "Linear",
      yoyo: true,
      onComplete: () => {
        this.indestructible = false;
      },
    });
  }

  destroy() {
    this.sprite.destroy();

    this.explosion = this.scene.physics.add.sprite(
      this.sprite.x,
      this.sprite.y,
      "explosion"
    );
    this.explosion.play("explode");
  }
}
export default Player;
