/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>
module Otterside {

    export class OttersideGame {
        public game: Phaser.Game;

        constructor() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

            this.game.state.add('Play', Otterside.PlayState);
        }

        public start() {
            this.game.state.start('Play');
        }
    }

    new OttersideGame().start();
}
