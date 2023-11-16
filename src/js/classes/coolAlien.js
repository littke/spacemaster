import Alien from "@/js/classes/alien.js";

import coolAlienImg from "@/assets/cool-alien.png";

class CoolAlien extends Alien {
  constructor(scene) {
    super(scene, "coolAlien", 4300, 1200, false, scene.alienBullets);
  }

  static preload(scene) {
    scene.load.image("coolAlien", coolAlienImg);
  }
}

export default CoolAlien;
