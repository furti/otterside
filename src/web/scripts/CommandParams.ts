namespace otterside {
    export interface CommandParams {
        /**
         * The phaser game object;
         * @type {Phaser.Game}
         */
        game: Phaser.Game;

        /**
         * All available game state names that can be started.
         * @type {GameStates}
         */
        gameStates: GameStates;

        /**
         * The console that executed the command. Can be used to output text.
         * @type {Console}
         */
        console: otterside.Console;

        gameManager: otterside.GameManager;
    }

    export interface GameStates {
        PreloadState: string;
        BootState: string;
        MainMenuState: string;
        PlayState: string;
    }
}
