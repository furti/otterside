/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>
module Otterside {
    module OttersideGame {
        var game: Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

        //setup all required states
        game.state.add(BootState.stateName, BootState);
        game.state.add(PreloadState.stateName, PreloadState);
        game.state.add(PlayState.stateName, PlayState);

        game.state.start(BootState.stateName);
    }
}
