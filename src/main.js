// src/main.js
import { GameEngine, Sprite } from './engine.js';

// --- Konfigurasi dari JSON ---
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;
const MAP_COLS = 25;
const MAP_ROWS = 25;
const GRAVITY = 0.5; // Disederhanakan dari z-gravity

const gameData = {
    // Data map (disalin dari JSON yang Anda berikan)
    map: {
        floorLayer: [1,45,45,45,27,45,45,20,9,20,20,20,20,20,20,20,9,9,20,20,20,20,20,20,20,19,27,45,45,27,45,27,20,9,20,20,20,20,20,20,20,20,45,45,9,20,20,20,20,20,19,9,45,45,9,27,27,9,45,20,20,20,20,20,20,20,20,20,20,9,20,20,20,20,20,19,45,45,45,45,45,45,45,45,20,20,20,20,20,20,20,20,20,20,45,20,20,20,20,20,19,45,45,45,45,45,45,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,19,20,20,20,20,20,20,20,20,38,38,38,38,38,38,38,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,39,74,74,74,74,74,74,74,37,20,20,20,20,20,20,20,74,20,20,20,20,20,20,20,39,74,74,74,74,74,74,74,74,74,37,20,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,38,38,38,20,20,20,20,20,20,20,20,20,3,74,74,74,74,74,74,74,74,74,1,20,39,74,74,74,19,20,45,20,20,20,20,20,20,20,3,74,74,74,74,74,74,74,1,38,39,74,74,74,74,19,21,9,20,20,20,20,20,20,20,20,2,2,109,110,111,2,2,39,74,74,74,10,74,74,19,20,9,20,45,20,20,20,9,20,20,20,20,127,128,129,20,21,74,74,10,10,10,74,1,20,21,45,9,9,45,20,20,20,20,20,127,128,128,128,129,20,21,74,10,10,10,10,74,19,20,21,20,20,20,20,20,20,20,20,20,127,128,128,128,129,20,21,74,10,10,10,74,1,20,20,21,20,20,20,20,20,20,20,20,20,127,128,128,128,129,20,21,74,74,10,10,74,19,20,20,21,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,2,3,74,74,74,19,20,20,21,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,2,2,2,20,20,20,21,20,20,20,20,20,20,20,38,38,38,20,20,20,20,20,38,38,38,38,38,38,38,38,38,39],
        wallsLayer: [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,0,0,0,0,0,20,20,20,20,20,0,0,0,0,0,20,20,20,20,20,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,20,20,20,0,0,0,0,0,0,0,20,20,20,20,20,20,20,0,0,0,0,0,0,0,20,20,20,20,20,20,0,0,20,20,20,20,20,20,20,20,20,20,20,20,0,0,0,0,0,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20]
    },
    // Lokasi aset dari JSON
    assets: {
        playerSkin: 'assets/sprites/player.png', // Placeholder - ganti dengan sprite pemain
        tilesheet: 'assets/sprites/tilesheet_complete.png'
    }
};

// --- Kelas Game ---

class Map {
    constructor(tilesheet) {
        this.tilesheet = tilesheet;
        this.floorLayer = gameData.map.floorLayer;
        this.wallsLayer = gameData.map.wallsLayer;
    }

    draw(ctx) {
        for (let i = 0; i < this.floorLayer.length; i++) {
            const tileId = this.floorLayer[i];
            if (tileId > 0) {
                const sx = ((tileId - 1) % 18) * TILE_WIDTH;
                const sy = Math.floor((tileId - 1) / 18) * TILE_HEIGHT;
                const dx = (i % MAP_COLS) * TILE_WIDTH;
                const dy = Math.floor(i / MAP_COLS) * TILE_HEIGHT;
                
                ctx.drawImage(this.tilesheet.image, sx, sy, TILE_WIDTH, TILE_HEIGHT, dx, dy, TILE_WIDTH, TILE_HEIGHT);
            }
        }
    }
}

class Player {
    constructor(x, y, playerSkin) {
        this.x = x;
        this.y = y;
        this.width = TILE_WIDTH; 
        this.height = TILE_HEIGHT;
        this.skin = playerSkin;

        this.speed = 4;
        this.jumpPower = 10;
        this.vy = 0;
        this.onGround = false;
    }

    collidesWith(wallsLayer) {
        for (let i = 0; i < wallsLayer.length; i++) {
            if (wallsLayer[i] > 0) {
                const wallX = (i % MAP_COLS) * TILE_WIDTH;
                const wallY = Math.floor(i / MAP_COLS) * TILE_HEIGHT;

                if (this.x < wallX + TILE_WIDTH &&
                    this.x + this.width > wallX &&
                    this.y < wallY + TILE_HEIGHT &&
                    this.y + this.height > wallY) {
                    return true;
                }
            }
        }
        return false;
    }

    update(keys) {
        // Horizontal Movement
        if (keys['KeyA'] || keys['ArrowLeft']) {
            this.x -= this.speed;
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
            this.x += this.speed;
        }
        
        // Vertical Movement (Gravity & Jump)
        this.vy += GRAVITY;
        this.y += this.vy;

        // Simplified Collision Detection
        let groundLevel = (MAP_ROWS - 5) * TILE_HEIGHT; // Contoh ground level
        if (this.y + this.height > groundLevel) {
            this.y = groundLevel - this.height;
            this.vy = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }

        if ((keys['Space'] || keys['KeyW']) && this.onGround) {
            this.vy = -this.jumpPower;
            this.onGround = false;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.skin.image, this.x, this.y, this.width, this.height);
    }
}


// --- Inisialisasi Game ---

const canvasWidth = 800;
const canvasHeight = 600;
const engine = new GameEngine('gameCanvas', canvasWidth, canvasHeight);

// Muat aset
const tilesheet = new Sprite(gameData.assets.tilesheet, TILE_WIDTH, TILE_HEIGHT);
const playerSkin = new Sprite(gameData.assets.playerSkin, 32, 32); // Ukuran sprite pemain disesuaikan

// Tunggu aset dimuat
Promise.all([
    new Promise(resolve => tilesheet.image.onload = resolve),
    new Promise(resolve => playerSkin.image.onload = resolve)
]).then(() => {
    // Buat entitas game
    const map = new Map(tilesheet);
    const player = new Player(10 * TILE_WIDTH, 11 * TILE_HEIGHT, playerSkin);

    engine.addEntity(map);
    engine.addEntity(player);

    // Pusatkan kamera pada pemain
    engine.camera.x = player.x - canvasWidth / 2;
    engine.camera.y = player.y - canvasHeight / 2;

    // Mulai game loop
    engine.start();
});
