/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>

module Otterside {
    export class BootState extends Phaser.State {
        public static stateName = 'Boot';

        public preload() {
            this.load.image('loadingBar', '/assets/loading-bar.png');
        }

        public create() {
            this.physics.startSystem(Phaser.Physics.ARCADE);

            //Set Background to white for loading
            this.game.stage.backgroundColor = '#fff';

            this.game.state.start(PreloadState.stateName);
        }
    }
}
