namespace otterside {
    export interface CommandParams {
        /**
         * [game description]
         * @type {Phaser.Game}
         */
        game: Phaser.Game;
        gameStates: GameStates;
    }

    export interface GameStates {
        PreloadState: string;
        BootState: string;
        MainMenuState: string;
        PlayState: string;
    }
}
