/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>
module Otterside {
    export class PlayState extends Phaser.State {
        private boardLayer: Phaser.TilemapLayer;
        private map: Phaser.Tilemap;

        public preload() {
            console.log('load');

            this.load.tilemap('ottersidemap', '/assets/map/otterside.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('ottersideTiles', '/assets/map/otterside-tiles.png');
        }

        public create() {
            console.log('create');

            this.map = this.game.add.tilemap('ottersidemap');

            this.map.addTilesetImage('otterside_tiles', 'ottersideTiles');

            this.boardLayer = this.map.createLayer('board');
            this.map.createLayer('walls');

            this.boardLayer.resizeWorld();
        }
    }
}
