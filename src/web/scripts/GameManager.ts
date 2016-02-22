namespace otterside {
    export interface GameManager {
        /**
         * Opens all doors associated to the currently active riddle.
         */
        openDoor(): void;

        /**
         * Marks the riddle as finished.
         */
        finishRiddle(): void;

        /**
         * Saves the current game state.
         */
        save(): void;
    }
}
