import Alien from "@/js/classes/alien.js";

import crashAlienImg from "@/assets/crash-alien.png";

class CrashAlien extends Alien {
  constructor(scene) {
    super(scene, "crashAlien", 4300, 1200, false, scene.alienBullets);
  }

  static preload(scene) {
    scene.load.image("crashAlien", crashAlienImg);
  }

  startShooting() {
    return null;
  }

  startMoving() {
    let move = () => {
      if (!this.active) return;

      this.body.setVelocityY(70);

      let direction = Phaser.Math.Between(-1, 1);
      let distance = Phaser.Math.Between(0, 100);

      // calculate the target x position
      let target = this.x + direction * distance;
      if (target > this.scene.game.config.width - this.width || target < 0) {
        target = [this.x];
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

export default CrashAlien;
