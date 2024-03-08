const STRIPES = 18;

class Stripes {
	create() {
		this.stripesPositions = [];
		this.stripesColors = [];

		var color = true;
		for (var i = 0; i < STRIPES; i++) {
			this.stripesPositions[i] = ((i + 1) * 4) * dpr;
			this.stripesColors[i] = color ? 0xff0000 : 0x0000ff;
			color = !color;
		}

		this.graphics = this.add.graphics();
		this.update();
	}

	update() {
		const graphics = this.graphics;
		graphics.clear();

		this.animate();
		this.draw(graphics, 100);
	}

	animate() {
		for (var i = 0; i < STRIPES; i++) {
			this.stripesPositions[i] += (0.2 * dpr);
		}

		if (this.stripesPositions[0] <= (4 * dpr)) {
			return;
		}

		this.stripesPositions.pop();
		this.stripesPositions.unshift(1);
		var color = this.stripesColors.pop();
		this.stripesColors.unshift(color);
	}

	draw(graphics, y) {
		for (var i = 0; i < STRIPES; i++) {
			graphics.fillStyle(this.stripesColors[i], 1.0);
			graphics.fillRect(0, y, screen_w, this.stripesPositions[i] * dpr);
			y += (this.stripesPositions[i] - 1) * dpr;
		}
	}
}
