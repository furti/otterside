/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>
module Otterside {

    export class OttersideGame {
        public game: Phaser.Game;
        public static type = 'OttersideGame';

        constructor() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

            this.game.state.add('Play', Otterside.PlayState);
        }

        public start() {
            //this.game.renderer.renderSession.roundPixels = true
            this.game.state.start('Play');
        }
    }
    var game = new OttersideGame();
    export var objectStore = new ObjectStore();

    objectStore.add(OttersideGame.type, game);

    game.start();
}
