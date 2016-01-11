/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>
module Otterside {
    export class PlayState extends Phaser.State {
        private boardLayer: Phaser.TilemapLayer;
        private map: Phaser.Tilemap;

        public preload() {
            this.load.tilemap('ottersidemap', '/assets/map/otterside.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('ottersideTiles', '/assets/map/otterside-tiles.png');
        }

        public create() {
            this.map = this.game.add.tilemap('ottersidemap');

            this.map.addTilesetImage('otterside-tiles', 'ottersideTiles');

            this.boardLayer = this.map.createLayer('ground');
            this.map.createLayer('walls');

            this.boardLayer.resizeWorld();
        }
    }
}
