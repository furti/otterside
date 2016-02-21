namespace otterside {
    export class OttersideGameManager implements GameManager {
        private static SAVEGAME_KEY = "savegame";
        private static PLAYERSTART_TYPE = 'player-start';
        private currentRiddle: string;
        private map: Phaser.Tilemap;
        private player: Phaser.Sprite;
        private saveGame: savegame.SaveGame;

        constructor() {
            this.saveGame = this.load();
        }

        /**
         * @param  {Phaser.Sprite}  player The player.
         */
        public setPlayer(player: Phaser.Sprite): void {
            this.player = player;
        }

        /**
         * @param {Phaser.Tilemap} map the map used in the game;
         */
        public setMap(map: Phaser.Tilemap): void {
            this.map = map;
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

        public playerPosition(): savegame.Point {
            if (this.saveGame && this.saveGame.playerPosition) {
                return this.saveGame.playerPosition;
            }

            return MapUtils.findFirstObjectByType(this.map, OttersideGameManager.PLAYERSTART_TYPE);
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
            this.addPlayerPosition();
            localStorage.setItem(OttersideGameManager.SAVEGAME_KEY, JSON.stringify(this.saveGame));
        }

        private addPlayerPosition(): void {
            this.saveGame.playerPosition = {
                x: this.player.x,
                y: this.player.y
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

    export var gameManager: OttersideGameManager = new OttersideGameManager();
}
