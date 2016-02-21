namespace otterside.savegame {
    export interface SaveGame {
        /**
         * Save the state of all game objects that need to be changed after restart.
         */
        gameObjectState?: { [objectName: string]: GameObjectState };

        /**
         * Save the last position of the player.
         */
        playerPosition?: {
            x: number;
            y: number;
        };

        riddleState?: { [riddleName: string]: RiddleState };
    }
}
