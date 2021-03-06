/// <reference path="./OttersideGameManager.ts"/>

namespace otterside {
    interface Keys {
        up: Phaser.Key;
        down: Phaser.Key;
        right: Phaser.Key;
        left: Phaser.Key;
        e: Phaser.Key;
    }

    export class PlayState extends Phaser.State {
        public static stateName = 'Play';

        private keys: Keys;
        private player: Phaser.Sprite;
        private boardLayer: Phaser.TilemapLayer;
        private wallLayer: Phaser.TilemapLayer;
        private map: Phaser.Tilemap;
        private objectGroup: Phaser.Group;
        private currentInteractible: GameObject<GameObjectProperties>;
        private minimap: MiniMap;
        private keyMapping = {
            'e': Phaser.Keyboard.E,
            'up': Phaser.Keyboard.UP,
            'down': Phaser.Keyboard.DOWN,
            'left': Phaser.Keyboard.LEFT,
            'right': Phaser.Keyboard.RIGHT
        };

        public create() {
            this.map = this.game.add.tilemap('ottersidemap');

            this.map.addTilesetImage('otterside-tiles', 'ottersideTiles');
            gameManager.setMap(this.map);

            this.boardLayer = this.map.createLayer('ground');
            this.wallLayer = this.map.createLayer('walls');

            this.map.setCollisionBetween(1, 20, true, 'walls');

            this.setupPlayer();
            this.boardLayer.resizeWorld();
            this.setupSpritesForObjects();

            this.registerKeys();
            this.minimap = new MiniMap(this.game, this.map, this.player);
        }

        public update() {
            this.movePlayer();
            this.checkForInteractiveObject();

            this.physics.arcade.collide(this.player, this.wallLayer);
            this.physics.arcade.collide(this.player, this.objectGroup);
        }

        private setupSpritesForObjects() {
            this.objectGroup = this.add.group();

            //Add physics for objects
            this.objectGroup.enableBody = true;
            gameManager.createFromObjects(this.objectGroup, this.map);
        }

        private registerKeys(): void {
            this.keys = this.input.keyboard.addKeys(this.keyMapping);

            InteractiveContent.on(InteractiveContentEvent.ACTIVATED, () => {
                this.input.enabled = false;
                this.removeKeyPressForKeys();
            });

            InteractiveContent.on(InteractiveContentEvent.DEACTIVATED, () => {
                this.input.enabled = true;
            });
        }

        /**
         * Somethimes w have to disable all keys because when the input is disabled it does not update the release of keys.
         */
        private removeKeyPressForKeys(): void {
            this.keys.up.isDown = false;
            this.keys.down.isDown = false;
            this.keys.right.isDown = false;
            this.keys.left.isDown = false;
            this.keys.e.isDown = false;
        }

        private setupPlayer() {
            var playerPosition = gameManager.playerPosition();

            //Add the player
            this.player = this.add.sprite(playerPosition.x, playerPosition.y, 'player');
            this.player.animations.add('left', [0, 1], 15, true);
            this.player.animations.add('right', [4, 5], 15, true);
            this.player.animations.add('faced', [2, 3], 15, true);

            this.physics.arcade.enable(this.player);

            this.camera.follow(this.player);

            gameManager.setPlayer(this.player);
        }

        private movePlayer(): void {
            var body: Phaser.Physics.Arcade.Body = this.player.body;

            body.velocity.x = 0;
            body.velocity.y = 0;

            if (InteractiveContent.isComponentActive()) {
                return;
            }

            if (this.keys.up.isDown) {
                body.velocity.y -= 100;

                this.player.animations.play('faced');
            }
            else if (this.keys.down.isDown) {
                body.velocity.y += 100;

                this.player.animations.play('faced');
            }
            else if (this.keys.right.isDown) {
                body.velocity.x += 100;

                this.player.animations.play('right');
            }
            else if (this.keys.left.isDown) {
                body.velocity.x -= 100;

                this.player.animations.play('left');
            }
            else {
                this.player.animations.stop();
                this.player.frame = 2;
            }
        }

        private checkForInteractiveObject(): void {
            var body = this.player.body;
            var playerMoved = body.velocity.x !== 0 || body.velocity.y !== 0;

            if (this.currentInteractible && !InteractiveContent.isComponentActive()) {
                if (this.keys.e.isDown) {
                    MapUtils.activateInteractiveComponent(this.currentInteractible, this.input.keyboard);
                }

                if (playerMoved) {
                    //Release the interactive component if the player moves away from it
                    var distance = Phaser.Math.distance(this.currentInteractible.x, this.currentInteractible.y, this.player.x, this.player.y);
                    if (distance > 40) {
                        this.currentInteractible = undefined;
                    }
                }

                return;
            }

            //Only check for new interactive component if the player moved
            if (playerMoved) {
                this.currentInteractible = MapUtils.findInteractibleObject(this.map, 'objects', this.player.x, this.player.y);
            }
        }
    }
}
