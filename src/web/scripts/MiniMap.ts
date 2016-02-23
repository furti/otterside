namespace otterside {
    var tileColor = {
        0: '#1F6D2F',
        1: '#1F6D2F',
        2: '#1F6D2F',
        3: '#1F6D2F',
        4: '#1F6D2F',
        5: '#1F6D2F',
        6: '#1F6D2F',
        7: '#1F6D2F',
        8: '#1F6D2F',
        9: '#1F6D2F',
        10: '#1F6D2F',
        11: '#000000',
        12: '#000000',
        15: '#000000',
        16: '#000000',
        18: '#000000'
    };

    export class MiniMap {
        private minimapTileSize = 2;
        private borderWidth = 8;
        private staticBitmapData: Phaser.BitmapData;
        private minimapSprite: Phaser.Sprite;
        private visible: boolean = false;

        constructor(private game: Phaser.Game, private map: Phaser.Tilemap) {
            this.staticBitmapData = game.add.bitmapData(map.width * this.minimapTileSize + this.borderWidth, map.height * this.minimapTileSize + this.borderWidth);

            this.addBorder();
            this.renderLayer('ground', this.staticBitmapData);
            this.renderLayer('walls', this.staticBitmapData);

            this.minimapSprite = new Phaser.Sprite(this.game, 0, 0, this.staticBitmapData);

            HotKeys.registerHotkey(Key.M, () => {
                this.toggle();
                return true;
            });

            // dynamic bmd where I draw mobile stuff like friends and enemies
            // g_game.miniMapOverlay = this.game.add.bitmapData(g_game.tileMap.width * g_game.miniMapSize, g_game.tileMap.height * g_game.miniMapSize);
            // this.game.add.sprite(g_game.miniMap.x, g_game.miniMap.y, g_game.miniMapOverlay);
        }

        public update(): void {
            if (this.visible) {
                this.minimapSprite.x = this.game.camera.x;
                this.minimapSprite.y = this.game.camera.y;
            }
        }

        public toggle(): void {
            if (this.visible) {
                this.game.world.remove(this.minimapSprite);
                this.visible = false;
            } else {
                this.game.world.add(this.minimapSprite);
                this.visible = true;
            }
        }

        private addBorder(): void {
            var height = this.map.height * this.minimapTileSize + this.borderWidth;
            var width = this.map.width * this.minimapTileSize + this.borderWidth;
            this.staticBitmapData.ctx.fillStyle = '#B2B6B8';

            this.staticBitmapData.ctx.fillRect(0, 0, this.borderWidth / 2, height);
            this.staticBitmapData.ctx.fillRect(0, 0, width, this.borderWidth / 2);
            this.staticBitmapData.ctx.fillRect(width - this.borderWidth / 2, 0, this.borderWidth / 2, height);
            this.staticBitmapData.ctx.fillRect(0, height - this.borderWidth / 2, width, this.borderWidth / 2);
        }

        private renderLayer(layerName: string, bitmapData: Phaser.BitmapData): void {
            for (let x = 0; x < this.map.width; x++) {
                for (let y = 0; y < this.map.height; y++) {
                    var tile = this.map.getTile(x, y, layerName);

                    if (tile) {
                        var color = tileColor[tile.index];

                        if (!color) {
                            Logger.error('MiniMap', `No color for tile index ${tile.index}`);
                            color = '#000000';
                        }

                        this.staticBitmapData.ctx.fillStyle = color;
                        this.staticBitmapData.ctx.fillRect(
                            (x * this.minimapTileSize) + (this.borderWidth / 2),
                            (y * this.minimapTileSize) + (this.borderWidth / 2),
                            this.minimapTileSize,
                            this.minimapTileSize);
                    }
                }
            }
        }
    }
}
