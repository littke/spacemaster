import Phaser from "phaser";

import UIScene from "./js/levels/uiscene.js";
import Level1 from "./js/levels/level1.js";
import Level2 from "./js/levels/level2.js";
import Level3 from "./js/levels/level3.js";

const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 900,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [UIScene, Level1, Level2, Level3],
};

let game = new Phaser.Game(config);
