import Phaser from "phaser";

import CoolAlien from "@/js/classes/coolAlien.js";

// Images
import coolAlienImg from "@/assets/cool-alien.png";

class Level3 extends Phaser.Scene {
  constructor() {
    super("Level3");
  }

  preload() {
    CoolAlien.preload(this);
  }

  create() {
    this.player = this.registry.get("player");
    this.playerBullets = this.registry.get("playerBullets");
    this.alienBullets = this.registry.get("alienBullets");
    this.config = this.sys.game.config;

    // Create the aliens
    this.coolAliens = this.physics.add.group({
      classType: CoolAlien,
    });

    // Spawn them
    for (let i = 0; i < 9; i++) {
      let alien = this.coolAliens.get();
      alien.setup(140 + 150 * i, 100);
    }

    // When a player bullet hits an alien
    this.physics.add.overlap(
      this.playerBullets,
      this.coolAliens,
      function (playerBullet, alien) {
        playerBullet.destroy();
        alien.kill();

        if (this.coolAliens.countActive() === 0 && this.player.sprite.active) {
          this.time.delayedCall(1000, () => {
            this.scene.launch("Level4");
          });
        }
      },
      null,
      this
    );
  }

  update() {}
}

export default Level3;
