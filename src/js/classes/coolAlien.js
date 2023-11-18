import Alien from "@/js/classes/alien.js";

import coolAlienImg from "@/assets/cool-alien.png";
import coolAlienBulletImg from "@/assets/cool-alien-bullet.png";

class CoolAlien extends Alien {
  constructor(scene) {
    super(
      scene,
      "coolAlien",
      2300,
      955,
      false,
      scene.alienBullets,
      "coolAlienBullet"
    );
  }

  static preload(scene) {
    scene.load.image("coolAlien", coolAlienImg);
    scene.load.image("coolAlienBullet", coolAlienBulletImg);
  }
}

export default CoolAlien;
