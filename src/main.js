// src/main.js
import { GameEngine } from './engine.js';

// --- Konfigurasi dari JSON (disederhanakan) ---
const TILE_SIZE = 16;
const MAP_COLS = 25;
const MAP_ROWS = 25;
const GRAVITY = 0.5;
const PLAYER_SPEED = 3.5;
const JUMP_POWER = 12;

const gameData = {
    // Data peta dari file JSON asli
    mapData: [1,45,45,45,27,45,45,20,9,20,20,20,20,20,20,20,9,9,20,20,20,20,20,20,20,19,27,45,45,27,45,27,20,9,20,20,20,20,20,20,20,20,45,45,9,20,20,20,20,20,19,9,45,45,9,27,27,9,45,20,20,20,20,20,20,20,20,20,20,9,20,20,20,20,20,19,45,45,45,45,45,45,45,45,20,20,20,20,20,20,20,20,20,20,45,20,20,20,20,20,19,45,45,45,45,45,45,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,19,20,20,20,20,20,20,20,20,38,38,38,38,38,38,38,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,39,74,74,74,74,74,74,74,37,20,20,20,20,20,20,20,74,20,20,20,20,20,20,20,39,74,74,74,74,74,74,74,74,74,37,20,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,20,20,20,20,20,20,20,20,20,20,20,21,74,74,74,74,74,74,74,74,74,74,74,19,20,38,38,38,20,20,20,20,20,20,20,20,20,3,74,74,74,74,74,74,74,74,74,1,20,39,74,74,74,19,20,45,20,20,20,20,20,20,20,3,74,74,74,74,74,74,74,1,38,39,74,74,74,74,19,21,9,20,20,20,20,20,20,20,20,2,2,109,110,111,2,2,39,74,74,74,10,74,74,19,20,9,20,45,20,20,20,9,20,20,20,20,127,128,129,20,21,74,74,10,10,10,74,1,20,21,45,9,9,45,20,20,20,20,20,127,128,128,128,129,20,21,74,10,10,10,10,74,19,20,21,20,20,20,20,20,20,20,20,20,127,128,128,128,129,20,21,74,10,10,10,74,1,20,20,21,20,20,20,20,20,20,20,20,20,127,128,128,128,129,20,21,74,74,10,10,74,19,20,20,21,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,2,3,74,74,74,19,20,20,21,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,2,2,2,20,20,20,21,20,20,20,20,20,20,20,38,38,38,20,20,20,20,20,38,38,38,38,38,38,38,38,38,39],
    assets: {
        playerSkin: './assets/sprites/player.png',
        tilesheet: './assets/sprites/tilesheet_updated.png', // <-- PERUBAHAN DI SINI
        jumpSound: './assets/sounds/jump.ogg'
    }
};

// --- Kelas Entitas Game (tetap sama) ---

class Map {
    constructor(tilesheetSrc, mapData) {
        this.tilesheet = new Image();
        this.tilesheet.src = tilesheetSrc;
        this.mapData = mapData;
    }

    getTile(col, row) {
        if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) {
            return 0;
        }
        return this.mapData[row * MAP_COLS + col];
    }

    draw(ctx) {
        if (!this.tilesheet.complete) return;
        for (let i = 0; i < this.mapData.length; i++) {
            const tileId = this.mapData[i];
            if (tileId > 0) {
                const sx = ((tileId - 1) % 18) * TILE_SIZE;
                const sy = Math.floor((tileId - 1) / 18) * TILE_SIZE;
                const dx = (i % MAP_COLS) * TILE_SIZE;
                const dy = Math.floor(i / MAP_COLS) * TILE_SIZE;
                ctx.drawImage(this.tilesheet, sx, sy, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

class Player {
    constructor(x, y, skinSrc) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.skin = new Image();
        this.skin.src = skinSrc;
        
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
    }

    handleCollision(map) {
        this.onGround = false;
        
        const leftTile = Math.floor(this.x / TILE_SIZE);
        const rightTile = Math.floor((this.x + this.width) / TILE_SIZE);
        const topTile = Math.floor(this.y / TILE_SIZE);
        const bottomTile = Math.floor((this.y + this.height) / TILE_SIZE);

        // Cek tabrakan dengan tile di bawah
        if (map.getTile(leftTile, bottomTile) > 0 || map.getTile(rightTile, bottomTile) > 0) {
            if (this.vy >= 0 && (this.y + this.height - this.vy) <= bottomTile * TILE_SIZE) {
                this.y = bottomTile * TILE_SIZE - this.height;
                this.vy = 0;
                this.onGround = true;
            }
        }

        // Cek tabrakan dengan tile di atas (jika melompat)
        if (map.getTile(leftTile, topTile) > 0 || map.getTile(rightTile, topTile) > 0) {
             if (this.vy < 0) {
                this.y = (topTile + 1) * TILE_SIZE;
                this.vy = 0;
            }
        }
    }

    update(keys, engine) {
        this.vx = 0;
        if (keys['KeyA'] || keys['ArrowLeft']) {
            this.vx = -PLAYER_SPEED;
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
            this.vx = PLAYER_SPEED;
        }
        
        this.vy += GRAVITY;
        
        if ((keys['Space'] || keys['KeyW']) && this.onGround) {
            this.vy = -JUMP_POWER;
            this.onGround = false;
            engine.playSound('jump');
        }

        this.y += this.vy;
        this.x += this.vx;

        this.handleCollision(engine.entities[0]);
        
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > MAP_COLS * TILE_SIZE) this.x = MAP_COLS * TILE_SIZE - this.width;

        engine.camera.x = this.x + this.width / 2 - engine.canvas.width / 2;
        engine.camera.y = this.y + this.height / 2 - engine.canvas.height / 2;

        if (engine.camera.x < 0) engine.camera.x = 0;
        if (engine.camera.y < 0) engine.camera.y = 0;
        if (engine.camera.x > MAP_COLS * TILE_SIZE - engine.canvas.width) {
            engine.camera.x = MAP_COLS * TILE_SIZE - engine.canvas.width;
        }
        if (engine.camera.y > MAP_ROWS * TILE_SIZE - engine.canvas.height) {
            engine.camera.y = MAP_ROWS * TILE_SIZE - engine.canvas.height;
        }
    }

    draw(ctx) {
        if (!this.skin.complete) return;
        ctx.drawImage(this.skin, this.x, this.y, this.width, this.height);
    }
}


// --- Inisialisasi Game ---
const canvasWidth = 480; 
const canvasHeight = 320;
const engine = new GameEngine('gameCanvas', canvasWidth, canvasHeight);

const map = new Map(gameData.assets.tilesheet, gameData.mapData);
const player = new Player(10 * TILE_SIZE, 10 * TILE_SIZE, gameData.assets.playerSkin); 

engine.loadSound('jump', gameData.assets.jumpSound);
engine.addEntity(map);
engine.addEntity(player);

engine.start();
