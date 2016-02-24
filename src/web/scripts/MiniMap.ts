namespace otterside {
    var tileColor = {
        0: '#FFFFFF',
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
        11: '#1F6D2F',
        12: '#000000',
        13: '#000000',
        15: '#000000',
        16: '#000000',
        18: '#000000',
        14: '#E95D17',
        17: '#E95D17',
        19: '#129AC7',
        20: '#17A91F'
    };

    export class MiniMap {
        private minimapTileSize = 3;
        private borderWidth = 8;
        private staticBitmapData: Phaser.BitmapData;
        private objectBitmapData: Phaser.BitmapData;
        private staticSprite: Phaser.Sprite;
        private objectSprite: Phaser.Sprite;
        private visible: boolean = false;
        private timer: Phaser.Timer;

        constructor(private game: Phaser.Game, private map: Phaser.Tilemap, private player: Phaser.Sprite) {
            this.staticBitmapData = game.add.bitmapData(map.width * this.minimapTileSize + this.borderWidth, map.height * this.minimapTileSize + this.borderWidth);
            this.objectBitmapData = game.add.bitmapData(map.width * this.minimapTileSize + this.borderWidth, map.height * this.minimapTileSize + this.borderWidth);

            this.addBorder();
            this.renderLayer('ground', this.staticBitmapData);
            this.renderLayer('walls', this.staticBitmapData);
            this.renderObjectLayer(MapUtils.OBJECT_LAYER_NAME, this.objectBitmapData);
            this.positionPlayer();

            this.staticSprite = new Phaser.Sprite(this.game, 0, 0, this.staticBitmapData);
            this.staticSprite.fixedToCamera = true;

            this.objectSprite = new Phaser.Sprite(this.game, 0, 0, this.objectBitmapData);
            this.objectSprite.fixedToCamera = true;

            HotKeys.registerHotkey(Key.M, () => {
                this.toggle();
                return true;
            });

            this.timer = game.time.create(false);
            this.timer.loop(5 * 1000, () => {
                this.renderObjectLayer(MapUtils.OBJECT_LAYER_NAME, this.objectBitmapData, true);
                this.positionPlayer();
            });
            this.timer.pause();
        }

        public toggle(): void {
            if (this.visible) {
                this.game.world.remove(this.staticSprite);
                this.game.world.remove(this.objectSprite);
                this.timer.pause();
                this.visible = false;
            } else {
                this.game.world.add(this.staticSprite);
                this.game.world.add(this.objectSprite);
                this.timer.start();
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

        private renderObjectLayer(layerName: string, bitmapData: Phaser.BitmapData, clear?: boolean): void {
            if (clear) {
                bitmapData.clear();
            }

            if (!this.map.objects[layerName]) {
                window.console.log('CreateFromObjects: No Objectsgroup with name ' + MapUtils.OBJECT_LAYER_NAME + ' found.');

                return;
            }

            this.map.objects[layerName].forEach((object: GameObject<GameObjectProperties>) => {
                //Only if the object is shown on screen
                if (object.sprite && object.sprite.alive) {
                    this.renderSpriteIndex(object.actualSpriteIndex, object.sprite.x / 32, object.sprite.y / 32, bitmapData);
                }
            });
        }

        private positionPlayer(): void {
            this.renderSpriteIndex(0, this.player.x / 32, this.player.y / 32, this.objectBitmapData);
        }

        private renderLayer(layerName: string, bitmapData: Phaser.BitmapData, clear?: boolean): void {
            if (clear) {
                bitmapData.ctx.clearRect(0, 0, this.map.width * this.minimapTileSize, this.map.height * this.minimapTileSize);
            }

            for (let x = 0; x < this.map.width; x++) {
                for (let y = 0; y < this.map.height; y++) {
                    var tile = this.map.getTile(x, y, layerName);

                    if (tile) {
                        this.renderSpriteIndex(tile.index, x, y, bitmapData);
                    }
                }
            }
        }

        private renderSpriteIndex(spriteIndex: number, x: number, y: number, bitmapData: Phaser.BitmapData): void {
            var color = tileColor[spriteIndex];

            if (!color) {
                Logger.error('MiniMap', `No color for spriteIndex ${spriteIndex}`);
                color = 'red';
            }

            bitmapData.ctx.fillStyle = color;
            bitmapData.ctx.fillRect(
                x * this.minimapTileSize,
                y * this.minimapTileSize,
                this.minimapTileSize,
                this.minimapTileSize);
        }
    }
}
