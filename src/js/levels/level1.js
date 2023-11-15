import Phaser from "phaser";

import Alien from "@/js/classes/alien.js";

// Music
import music1File from "@/assets/music/172_drum_n_bass_regal_heavy_electronic_drums.wav";

// Images
import alienImg from "@/assets/alien.png";

class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  preload() {
    this.load.audio("level1Music", music1File);
    this.load.image("alien", alienImg);
  }

  create() {
    this.player = this.registry.get("player");
    this.playerBullets = this.registry.get("playerBullets");
    this.alienBullets = this.registry.get("alienBullets");
    this.config = this.sys.game.config;

    /*
     *
     * DEVELOPMENT TOOLS
     *
     * Enable these as query strings when needed
     * *
     */

    this.params = new URLSearchParams(window.location.search);

    // Add music, unless the user said they don't want it
    if (this.params.get("noMusic") !== "true") {
      if (!this.level1Music) {
        this.level1Music = this.sound.add("level1Music");
        this.level1Music.setVolume(0.8);
        this.level1Music.play();
      }
    }

    // Define the aliens
    // TODO: Move to it's own class
    class RegularAlien extends Alien {
      constructor(scene) {
        super(scene, "alien", 4300, 1200, false, scene.alienBullets);
      }
    }

    // Create the aliens
    this.regularAliens = this.physics.add.group({
      classType: RegularAlien,
    });

    // Spawn them
    for (let i = 0; i < 3; i++) {
      let alien = this.regularAliens.get();
      alien.setup(370 + 390 * i, 100);
    }

    /*
     * OVERLAPS
     */

    // When a player bullet hits an alien (or later, a boss alien)
    this.physics.add.overlap(
      this.playerBullets,
      this.regularAliens,
      function (playerBullet, alien) {
        playerBullet.destroy();
        this.sound.play("explosionSound");
        if (alien.nextShootEvent) {
          alien.nextShootEvent.remove();
        }
        alien.destroy();

        // Drop an upgrade
        let dropUpgradeChance = Phaser.Math.Between(0, 100);
        if (dropUpgradeChance > 80) {
          alien.dropUpgrade.x2();
        }

        // Let's see if all regular aliens are dead
        this.aliensAlive = false;
        this.regularAliens.getChildren().forEach((alien) => {
          if (alien.active) {
            this.aliensAlive = true;
          }
        });
        if (this.aliensAlive === false && this.player.sprite.active) {
          this.scene.start("Level2");
        }
      },
      null,
      this
    );
  }

  update() {}
}

export default Level1;
