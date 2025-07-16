// src/engine.js
export class GameEngine {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.imageSmoothingEnabled = false; // Untuk pixel art

        this.keys = {};
        this.camera = { x: 0, y: 0 };
        this.entities = [];

        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update() {
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(this.keys);
            }
        });
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        this.entities.forEach(entity => {
            if (entity.draw) {
                entity.draw(this.ctx);
            }
        });

        this.ctx.restore();
    }

    gameLoop() {
        this.clear();
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    start() {
        this.gameLoop();
    }
}

export class Sprite {
    constructor(src, width, height, frameCount = 1) {
        this.image = new Image();
        this.image.src = src;
        this.width = width;
        this.height = height;
        this.frameCount = frameCount;
    }
}
