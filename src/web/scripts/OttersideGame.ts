/**
 * Main Module for the Game
 */
module Otterside {

    /**
     * Object contained in the "objects" layer of the tiled map.
     *
     * @param <PROPS> type of properties for this object
     */
    export interface GameObject<PROPS extends GameObjectProperties> {
        id: number;
        name: string;
        type: string;

        x: number;
        y: number;
        height: number;
        width: number;

        sprite: Phaser.Sprite;

        properties: PROPS;
    }

    /**
     * Properties that all GameObjects have
     */
    export interface GameObjectProperties {
        spriteIndex: string;
        moveable?: string;
    }

    /**
     *	Properties for Objects that belong to an riddle.
     */
    export interface RiddleObjectProperties extends GameObjectProperties {
        riddle: string;
    }

    module OttersideGame {
        var game: Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

        //setup all required states
        game.state.add(BootState.stateName, BootState);
        game.state.add(PreloadState.stateName, PreloadState);
        game.state.add(MainMenuState.stateName, MainMenuState);
        game.state.add(PlayState.stateName, PlayState);

        game.state.start(BootState.stateName);
    }
}
