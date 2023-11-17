class Hearts {
  constructor(scene, x, y, maxLives) {
    this.x = x;
    this.y = y;
    this.maxLives = maxLives;
    this.currentLives = maxLives;
    this.scene = scene;

    this.hearts = scene.add.group({
      key: "heart",
      repeat: this.maxLives - 1,
      setXY: { x: this.x, y: this.y, stepX: 46 },
    });
  }

  decrease(amount) {
    this.currentLives -= amount;

    // Can't go below 0
    if (this.currentLives < 0) {
      this.currentLives = 0;
    }

    this.hearts.getChildren().forEach((heart, index) => {
      if (index < this.currentLives) {
        heart.setAlpha(1);
      } else {
        // Fade out
        this.scene.tweens.add({
          targets: heart,
          alpha: 0,
          duration: 300, // Perform fade over half a second
          ease: "Linear",
        });
      }
    });
  }
}

export default Hearts;
