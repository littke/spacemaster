import Phaser from "phaser";

import RegularAlien from "@/js/classes/regularAlien.js";

// Music
import music1File from "@/assets/music/172_drum_n_bass_regal_heavy_electronic_drums.wav";

// Images

class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  preload() {
    this.load.audio("level1Music", music1File);
    RegularAlien.preload(this);
  }

  create() {
    this.player = this.registry.get("player");
    this.playerBullets = this.registry.get("playerBullets");
    this.aliens = this.registry.get("aliens");
    this.alienBullets = this.registry.get("alienBullets");
    this.config = this.sys.game.config;

    this.params = new URLSearchParams(window.location.search);

    // Add music, unless the user said they don't want it
    if (this.params.get("noMusic") !== "true") {
      if (!this.level1Music) {
        this.level1Music = this.sound.add("level1Music");
        this.level1Music.setVolume(0.8);
        this.level1Music.play();
      }
    }
    // Create the aliens
    this.regularAliens = this.physics.add.group({
      classType: RegularAlien,
    });

    // Spawn them
    for (let i = 0; i < 6; i++) {
      let alien = this.regularAliens.get();
      alien.setup(250 + 190 * i, 100);
    }

    // When a player bullet hits an alien
    this.physics.add.overlap(
      this.playerBullets,
      this.regularAliens,
      function (playerBullet, alien) {
        playerBullet.destroy();
        alien.kill();

        if (
          this.regularAliens.countActive() === 0 &&
          this.player.sprite.active
        ) {
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
