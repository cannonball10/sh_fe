class Input {
  constructor() {
    this.keys = new Set();
    this.map = {
      ArrowUp: "up",
      KeyW: "up",
      ArrowDown: "down",
      KeyS: "down",
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right"
    };

    window.addEventListener("keydown", (event) => {
      const action = this.map[event.code];
      if (action) {
        this.keys.add(action);
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      const action = this.map[event.code];
      if (action) {
        this.keys.delete(action);
        event.preventDefault();
      }
    });
  }

  isDown(action) {
    return this.keys.has(action);
  }
}

class BasicScene {
  constructor(bounds, input) {
    this.bounds = bounds;
    this.input = input;
    this.player = {
      x: 100,
      y: 100,
      size: 30,
      speed: 220
    };
  }

  update(dt) {
    const directionX = (this.input.isDown("right") ? 1 : 0) - (this.input.isDown("left") ? 1 : 0);
    const directionY = (this.input.isDown("down") ? 1 : 0) - (this.input.isDown("up") ? 1 : 0);

    this.player.x += directionX * this.player.speed * dt;
    this.player.y += directionY * this.player.speed * dt;

    const maxX = this.bounds.width - this.player.size;
    const maxY = this.bounds.height - this.player.size;
    this.player.x = Math.max(0, Math.min(this.player.x, maxX));
    this.player.y = Math.max(0, Math.min(this.player.y, maxY));
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.bounds.width, this.bounds.height);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);

    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(this.player.x, this.player.y, this.player.size, this.player.size);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "16px sans-serif";
    ctx.fillText("Move with Arrow Keys or WASD", 16, 28);
  }
}

class GameFramework {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.input = new Input();
    this.scene = new BasicScene({ width: canvas.width, height: canvas.height }, this.input);
    this.lastTime = null;
    this.maxDelta = 0.05;
    this.loop = this.loop.bind(this);
  }

  start() {
    requestAnimationFrame(this.loop);
  }

  loop(timestamp) {
    if (this.lastTime === null) {
      this.lastTime = timestamp;
    }
    const dt = Math.min((timestamp - this.lastTime) / 1000, this.maxDelta);
    this.lastTime = timestamp;
    this.scene.update(dt);
    this.scene.render(this.ctx);
    requestAnimationFrame(this.loop);
  }
}

const canvas = document.getElementById("gameCanvas");
if (canvas instanceof HTMLCanvasElement) {
  const game = new GameFramework(canvas);
  game.start();
}
