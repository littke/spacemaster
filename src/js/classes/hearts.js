class Hearts {
  constructor(scene, x, y, maxLives) {
    this.x = x;
    this.y = y;
    this.maxLives = maxLives;
    this.currentLives = maxLives;

    this.hearts = scene.add.group({
      key: "heart",
      repeat: this.maxLives - 1,
      setXY: { x: this.x, y: this.y, stepX: 32 },
    });
  }

  decrease(amount) {
    this.currentLives -= amount;

    // Can't go below 0
    if (this.currentLives < 0) {
      this.currentLives = 0;
    }

    // Redraw hearts
    this.hearts.getChildren().forEach((heart, index) => {
      heart.setVisible(index < this.currentLives);
    });
  }
}

export default Hearts;
