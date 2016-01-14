/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>

module Otterside {
    export class PreloadState extends Phaser.State {
        public static stateName = 'Preload';

        public preload() {
            var loadingBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loadingBar');
            loadingBar.anchor.setTo(0.5);

            this.load.setPreloadSprite(loadingBar);

            this.load.tilemap('ottersidemap', '/assets/map/otterside.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.spritesheet('ottersideTiles', '/assets/map/otterside-tiles.png', 32, 32);
            this.load.spritesheet('player', '/assets/player.png', 32, 32);
        }

        public create() {
            this.game.state.start(PlayState.stateName);
        }
    }
}
