namespace otterside.savegame {
    export interface GameObjectState {
        /**
         * If true, the object will be removed from the map when the game is loaded.
         */
        deleted?: boolean;
    }
}
