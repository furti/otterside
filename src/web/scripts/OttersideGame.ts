/// <reference path="./BootState.ts"/>
/// <reference path="./PreloadState.ts"/>
/// <reference path="./MainMenuState.ts"/>
/// <reference path="./PlayState.ts"/>

/**
 * Main Module for the Game
 */
namespace otterside {

    /**
     * Object contained in the "objects" layer of the tiled map.
     *
     * @param <PROPS> type of properties for this object
     */
    export interface GameObject<PROPS extends GameObjectProperties> {
        /**
         * The Objects Id
         * @type {number}
         */
        id: number;

        /**
         * The Objects name
         * @type {string}
         */
        name: string;

        /**
         * The objects type. This is used to find all objects for a certain action.
         *
         * @type {string}
         */
        type: string;

        /**
         * Location on the x axis.
         * @type {number}
         */
        x: number;

        /**
         * Location on the y axis.
         * @type {number}
         */
        y: number;


        height: number;
        width: number;

        /**
         * The sprite associated with this object. Will only be set if properties.spriteindex is set.
         * @type {Phaser.Sprite}
         */
        sprite?: Phaser.Sprite;

        /**
         * The acutal spriteIndex used. E.g. finished riddles have a other sprite than open ones.
         */
        actualSpriteIndex?: number;

        /**
         * Further properties for the object.
         * @type {PROPS}
         */
        properties: PROPS;
    }

    /**
     * Properties that all GameObjects have
     */
    export interface GameObjectProperties {
        /**
         * The Index of the sprite to render for this object.
         */
        spriteIndex: string;

        /**
         * If "true" the object can be pushed by the player to move. Otherwise it blocks the player.
         */
        moveable?: string;

        /**
         * If true the player can interact with this component;
         */
        interactive?: string;

        /**
         * The name of the riddle the object belongs to.
         */
        riddle?: string;
    }

    /**
     *	Properties for Objects that belong to an riddle.
     */
    export interface RiddleObjectProperties extends GameObjectProperties {
        /**
         * The id of the riddle the object belongs to.
         * @type {string}
         */
        riddle: string;
    }

    export var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    window.console.log(OttersideGameManager);

    //setup all required states
    game.state.add(BootState.stateName, BootState);
    game.state.add(PreloadState.stateName, PreloadState);
    game.state.add(MainMenuState.stateName, MainMenuState);
    game.state.add(PlayState.stateName, PlayState);

    game.state.start(BootState.stateName);
}
