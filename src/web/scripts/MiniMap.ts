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
        19: '#FFEE57',
        20: '#17A91F'
    };

    export class MiniMap {
        private minimapTileSize = 3;
        private borderWidth = 8;
        private staticBitmapData: Phaser.BitmapData;
        private dynamicBitmapData: Phaser.BitmapData;
        private staticSprite: Phaser.Sprite;
        private objectSprite: Phaser.Sprite;
        private visible: boolean = false;
        private timer: Phaser.Timer;
        private minimapWidth: number;
        private minimapHeight: number;
        private playerVisible: boolean;
        private lastPlayerPosition: otterside.savegame.Point;

        constructor(private game: Phaser.Game, private map: Phaser.Tilemap, private player: Phaser.Sprite) {
            this.minimapWidth = map.width * this.minimapTileSize;
            this.minimapHeight = map.height * this.minimapTileSize;
            this.playerVisible = false;

            this.staticBitmapData = game.add.bitmapData(this.minimapWidth + this.borderWidth, this.minimapHeight + this.borderWidth);
            this.dynamicBitmapData = game.add.bitmapData(map.width * this.minimapTileSize + this.borderWidth, map.height * this.minimapTileSize + this.borderWidth);

            this.addShadow();
            this.renderLayer('ground', this.staticBitmapData);
            this.renderLayer('walls', this.staticBitmapData);
            this.renderObjectLayer(MapUtils.OBJECT_LAYER_NAME, this.dynamicBitmapData);

            this.staticSprite = new Phaser.Sprite(this.game, 0, 0, this.staticBitmapData);
            this.staticSprite.fixedToCamera = true;

            this.objectSprite = new Phaser.Sprite(this.game, 0, 0, this.dynamicBitmapData);
            this.objectSprite.fixedToCamera = true;

            HotKeys.registerHotkey(Key.M, () => {
                this.toggle();
                return true;
            });

            this.timer = game.time.create(false);
            this.timer.loop(800, () => {
                this.updatePlayer();
            });

            gameManager.setMinimap(this);
        }

        public updateObjects(): void {
            this.renderObjectLayer(MapUtils.OBJECT_LAYER_NAME, this.dynamicBitmapData, true);
            this.dynamicBitmapData.dirty = true;
        }

        public toggle(): void {
            if (this.visible) {
                this.game.world.remove(this.staticSprite);
                this.game.world.remove(this.objectSprite);
                this.timer.pause();
                this.visible = false;

                //Clear the last player position if needed. Otherwise we have a lost player point on the minimap
                if (this.playerVisible) {
                    this.updatePlayer();
                    this.playerVisible = false;
                }
            } else {
                this.game.world.add(this.staticSprite);
                this.game.world.add(this.objectSprite);

                if (!this.timer.running) {
                    this.timer.start();
                }
                else {
                    this.timer.resume();
                }

                this.visible = true;
            }
        }

        private addShadow(): void {
            var height = this.map.height * this.minimapTileSize + this.borderWidth;
            var width = this.map.width * this.minimapTileSize + this.borderWidth;

            this.staticBitmapData.ctx.save();

            this.staticBitmapData.ctx.globalAlpha = 0.2;
            this.staticBitmapData.ctx.fillStyle = '#000000';

            this.staticBitmapData.ctx.fillRect(0, 0, this.minimapWidth + this.borderWidth, this.minimapHeight + this.borderWidth);

            this.staticBitmapData.ctx.restore();
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

        private updatePlayer(): void {
            if (this.playerVisible) {
                this.dynamicBitmapData.ctx.clearRect(this.lastPlayerPosition.x * this.minimapTileSize, this.lastPlayerPosition.y * this.minimapTileSize, this.minimapTileSize, this.minimapTileSize);
                this.playerVisible = false;
            }
            else {
                this.lastPlayerPosition = {
                    x: Math.round(this.player.x / 32),
                    y: Math.round(this.player.y / 32)
                };

                this.renderSpriteIndex(0, this.lastPlayerPosition.x, this.lastPlayerPosition.y, this.dynamicBitmapData);
                this.playerVisible = true;
            }

            this.dynamicBitmapData.dirty = true;
        }

        private renderLayer(layerName: string, bitmapData: Phaser.BitmapData, clear?: boolean): void {
            if (clear) {
                bitmapData.ctx.clearRect(0, 0, this.minimapWidth, this.minimapHeight);
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
                Logger.error('MiniMap', `No color for spriteIndex ${spriteIndex} at point {x: ${x}, y: ${y}}`);
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
