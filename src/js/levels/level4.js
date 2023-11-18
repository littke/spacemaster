import Phaser from "phaser";

import CoolAlien from "@/js/classes/coolAlien.js";
import RegularAlien from "@/js/classes/regularAlien.js";

class Level4 extends Phaser.Scene {
  constructor() {
    super("Level4");
  }

  preload() {
    CoolAlien.preload(this);
    RegularAlien.preload(this);
  }

  create() {
    this.player = this.registry.get("player");
    this.playerBullets = this.registry.get("playerBullets");
    this.alienBullets = this.registry.get("alienBullets");
    this.config = this.sys.game.config;

    this.allAliens = this.physics.add.group({});

    this.coolAliens = this.physics.add.group({
      classType: CoolAlien,
    });

    for (let i = 0; i < 8; i++) {
      let alien = this.coolAliens.get();
      alien.setup(70 + 139 * i, 100);
      this.allAliens.add(alien);
    }

    this.regularAliens = this.physics.add.group({
      classType: RegularAlien,
    });

    for (let i = 0; i < 7; i++) {
      let alien = this.regularAliens.get();
      alien.setup(860 + 92 * i, 100);
      this.allAliens.add(alien);
    }

    // When a player bullet hits an alien
    this.physics.add.overlap(
      this.playerBullets,
      this.allAliens,
      function (playerBullet, alien) {
        playerBullet.destroy();
        alien.kill();

        if (
          this.coolAliens.countActive() === 0 &&
          this.regularAliens.countActive() === 0 &&
          this.player.sprite.active
        ) {
          this.player.indesctruible = true;
          this.time.delayedCall(1000, () => {
            this.scene.launch("Level5");
          });
        }
      },
      null,
      this
    );
  }

  update() {}
}

export default Level4;
