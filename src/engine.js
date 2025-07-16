    draw() {
        this.ctx.save();
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.translate(-this.camera.x, -this.camera.y);

        this.entities.forEach(entity => {
            if (entity.draw) {
                entity.draw(this.ctx);
            }
        });

        this.ctx.restore(); // <-- Penting, kembalikan konteks sebelum menggambar HUD

        // --- Kode BARU untuk HUD ---
        // Gambar HUD setelah restore agar tidak ikut bergerak dengan kamera
        const player = this.entities.find(e => e instanceof Player);
        if (player) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px sans-serif';
            this.ctx.fillText(`Score: ${player.score}`, 10, 30);
        }
    }
