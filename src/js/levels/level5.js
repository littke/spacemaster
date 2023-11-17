import Phaser from "phaser";

import CrashAlien from "@/js/classes/crashAlien.js";

class Level5 extends Phaser.Scene {
  constructor() {
    super("Level5");
  }

  preload() {
    CrashAlien.preload(this);
  }

  create() {
    this.player = this.registry.get("player");
    this.playerBullets = this.registry.get("playerBullets");
    this.config = this.sys.game.config;

    this.crashAliens = this.physics.add.group({
      classType: CrashAlien,
    });

    for (let i = 0; i < 8; i++) {
      let alien = this.crashAliens.get();
      alien.setup(70 + 139 * i, 100);
    }

    // When a player bullet hits an alien
    this.physics.add.overlap(
      this.playerBullets,
      this.crashAliens,
      function (playerBullet, alien) {
        playerBullet.destroy();
        alien.kill();

        if (this.crashAliens.countActive() === 0 && this.player.sprite.active) {
          this.time.delayedCall(1000, () => {
            let text = this.add
              .text(0, 0, "You win!", {
                fontFamily: '"Arial Black", "Arial Bold", "Arial", sans-serif',
                fontSize: "64px",
                fill: "#fff",
              })
              .setOrigin(0.5, 0.5)
              .setPosition(this.config.width / 2, this.config.height / 2);
          });
        }
      },
      null,
      this
    );
  }

  update() {}
}

export default Level5;
