/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>
module Otterside {
    class PlayerStart {
        public static type = 'player-start';
        public x: number;
        public y: number;
        public type: string;
    }

    export class PlayState extends Phaser.State {
        public static stateName = 'Play';

        private cursorKeys: Phaser.CursorKeys;
        private player: Phaser.Sprite;
        private boardLayer: Phaser.TilemapLayer;
        private wallLayer: Phaser.TilemapLayer;
        private map: Phaser.Tilemap;
        private objectGroup: Phaser.Group;

        public create() {
            this.map = this.game.add.tilemap('ottersidemap');

            this.map.addTilesetImage('otterside-tiles', 'ottersideTiles');

            this.boardLayer = this.map.createLayer('ground');
            this.wallLayer = this.map.createLayer('walls');

            this.map.setCollisionBetween(1, 20, true, 'walls');

            this.boardLayer.resizeWorld();
            this.setupSpritesForObjects();
            this.setupPlayer();
        }

        public update() {
            var body: Phaser.Physics.Arcade.Body = this.player.body;

            body.velocity.x = 0;
            body.velocity.y = 0;

            if (this.cursorKeys.up.isDown) {
                body.velocity.y -= 100;
            }
            else if (this.cursorKeys.down.isDown) {
                body.velocity.y += 100;
            }

            if (this.cursorKeys.right.isDown) {
                body.velocity.x += 100;
            }
            else if (this.cursorKeys.left.isDown) {
                body.velocity.x -= 100;
            }

            this.physics.arcade.collide(this.player, this.wallLayer);
            this.physics.arcade.collide(this.player, this.objectGroup);
        }

        private setupSpritesForObjects() {
            this.objectGroup = this.add.group();

            //Add physics for objects
            this.objectGroup.enableBody = true;

            MapUtils.createFromObjects(this.objectGroup, this.map, 'objects');
        };

        private setupPlayer() {
            var playerStart = MapUtils.findFirstObjectByType(this.map, 'objects', PlayerStart.type, PlayerStart);

            //Add the player
            this.player = this.add.sprite(playerStart.x, playerStart.y, 'player');
            this.physics.arcade.enable(this.player);

            this.camera.follow(this.player);

            this.cursorKeys = this.input.keyboard.createCursorKeys();
        }
    }
}
