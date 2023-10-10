class HealthBar {
  constructor(scene, x, y, maxLife, width, height) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.maxLife = maxLife;
    this.currentHealth = maxLife;
    this.percent = 1;

    this.width = width || 80;
    this.height = height || 14;

    this.draw();

    scene.add.existing(this.bar);
  }

  decrease(amount) {
    this.currentHealth -= amount;

    if (this.currentHealth < 0) {
      this.currentHealth = 0;
    }

    this.percent = this.currentHealth / this.maxLife;
    this.draw();
  }

  draw() {
    this.bar.clear();

    // White BG
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 2, this.y + 2, this.width, this.height);

    if (this.percent < 0.3) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    // Actual health bar
    var d = Math.floor(this.percent * this.width);

    this.bar.fillRect(this.x + 2, this.y + 2, d, this.height);
  }
}

export default HealthBar;
