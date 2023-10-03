import Hearts from "./hearts.js";

class Player {
  constructor(scene, x, y, playerSpeed, playerWeapon, playerHealth) {
    this.speed = playerSpeed;
    this.weapon = playerWeapon;
    this.health = playerHealth;

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
    this.health -= amount;
    this.hearts.decrease(amount);
  }

  destroy() {
    this.sprite.destroy();
  }
}
export default Player;
