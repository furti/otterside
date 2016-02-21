namespace otterside {
    export var gameManager: OttersideGameManager;

    export class OttersideGameManager implements GameManager {
        private static SAVEGAME_KEY = "savegame";
        private currentRiddle: string;
        private saveGame: savegame.SaveGame;

        constructor(private game: Phaser.Game, private map: Phaser.Tilemap) {
            this.saveGame = this.load();
        }

        /**
         * Initialize the game manager
         * @param  {Phaser.Game}    game The game
         * @param  {Phaser.Tilemap} map  The map is used to interact with the object layer.
         */
        public static initialize(game: Phaser.Game, map: Phaser.Tilemap): void {
            gameManager = new OttersideGameManager(game, map);
        }

        /**
         * Starts a new riddle. Following operations need a active riddle to work properly.
         * @param  {string} riddleName Name of the riddle.
         */
        public startRiddle(riddleName: string): void {
            this.currentRiddle = riddleName;
        }

        /**
         * Removes all state for the current active riddle.
         */
        public stopCurrentRiddle(): void {
            delete this.currentRiddle;
        }

        /**
         * @return {string[]} the names of all hidden gameObjects;
         */
        public getHiddenGameObjectNames(): string[] {
            if (!this.saveGame.gameObjectState) {
                return [];
            }
            else {
                var hiddenNames = [];

                for (let objectName of Object.keys(this.saveGame.gameObjectState)) {
                    if (this.saveGame.gameObjectState[objectName].deleted) {
                        hiddenNames.push(objectName);
                    }
                }

                return hiddenNames;
            }
        }

        /**
         * Opens all doors for the current active riddle. If no riddle is active a error will be logged and nothing happens.
         */
        public openDoor(): void {
            if (!this.currentRiddle) {
                Logger.error('OttersideGameManager', 'openDoor was called without a active riddle.');
                return;
            }

            var doors = MapUtils.findObjects(this.map, (object) => {
                return object.type === 'door' && object.properties.riddle === this.currentRiddle;
            });

            if (!doors || doors.length === 0) {
                Logger.error('OttersideGameManager', `Error finding doors for riddle ${this.currentRiddle}`);
            }
            else {
                //Remove the sprites for every door
                doors.forEach((door) => {
                    door.sprite.kill();
                    this.getOrCreateGameObjectState(door.name).deleted = true;
                });

                this.save();
            }
        }

        /**
         * Checks if the GameObjectState for the given objectName exists and returns it.
         * If no state exists a new one will be created and added to the SaveGame;
         * @param  {string}                   objectName The name of the game object.
         * @return {savegame.GameObjectState}            The saved state for this object.
         */
        private getOrCreateGameObjectState(objectName: string): savegame.GameObjectState {
            if (!this.saveGame.gameObjectState) {
                this.saveGame.gameObjectState = {};
            }

            var gameObjectState = this.saveGame.gameObjectState[objectName];

            if (!gameObjectState) {
                gameObjectState = {};
                this.saveGame.gameObjectState[objectName] = gameObjectState;
            }

            return gameObjectState;
        }

        private save(): void {
            if (this.saveGame) {
                localStorage.setItem(OttersideGameManager.SAVEGAME_KEY, JSON.stringify(this.saveGame));
            }
        }

        private load(): savegame.SaveGame {
            var saveGameString: string = localStorage.getItem(OttersideGameManager.SAVEGAME_KEY);

            if (saveGameString && saveGameString.trim().length > 0) {
                return JSON.parse(saveGameString);
            }
            else {
                return {};
            }
        }
    }
}
