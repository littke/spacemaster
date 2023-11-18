import Alien from "@/js/classes/alien.js";

import regularAlienImg from "@/assets/regular-alien.png";

class RegularAlien extends Alien {
  constructor(scene) {
    super(scene, "regularAlien", 4300, 1200, false, scene.alienBullets);
  }

  static preload(scene) {
    scene.load.image("regularAlien", regularAlienImg);
  }
}

export default RegularAlien;
