import Phaser from "phaser";

// Classes
import BossAlien from "@/js/classes/bossAlien.js";

class Level2 extends Phaser.Scene {
  constructor() {
    super("Level2");
  }

  preload() {
    BossAlien.preload(this);
  }

  create() {
    BossAlien.createAnimations(this);

    this.player = this.registry.get("player");
    this.playerBullets = this.registry.get("playerBullets");
    this.alienBullets = this.registry.get("alienBullets");
    this.config = this.sys.game.config;

    this.bossAlienGroup = this.physics.add.group({ classType: BossAlien });
    this.bossAlien = this.bossAlienGroup.get();
    this.bossAlien.setup(this.config.width / 2, 170);

    this.events.on(
      "bossAlienDied",
      () => {
        if (this.player.sprite.active) {
          this.time.delayedCall(1000, () => {
            this.scene.launch("Level3");
          });
        }
      },
      this
    );
  }

  update() {}

  shutdown() {
    this.events.off("bossAlienDied");
  }
}

export default Level2;
