/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>
module Otterside {

    export interface GameObject {
        id: number;
        name: string;
        type: string;

        x: number;
        y: number;
        height: number;
        width: number;

        sprite: Phaser.Sprite;

        properties: GameObjectProperties;
    }

    export interface GameObjectProperties {
        spriteIndex: string;
        moveable?: string;
    }

    export interface RiddleGameProperties extends GameObjectProperties {
        riddle: string;
    }

    module OttersideGame {
        var game: Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

        //setup all required states
        game.state.add(BootState.stateName, BootState);
        game.state.add(PreloadState.stateName, PreloadState);
        game.state.add(PlayState.stateName, PlayState);

        game.state.start(BootState.stateName);
    }
}
