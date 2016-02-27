namespace otterside {
    export class OttersideGameManager implements GameManager {
        private static SAVEGAME_KEY = "savegame";
        private static PLAYERSTART_TYPE = 'player-start';
        private currentRiddle: string;
        private map: Phaser.Tilemap;
        private player: Phaser.Sprite;
        private saveGame: savegame.SaveGame;
        private objectsGroup: Phaser.Group;
        private minimap: MiniMap;

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

        public setMinimap(minimap: MiniMap): void {
            this.minimap = minimap;
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
         * Create sprites from the objects group in the tiled map.
         *
         * @param {Phaser.Group} group The group to add the sprites to.
         * @param {Phaser.Tilemap} map The map to read the objects from.
         */
        public createFromObjects(group: Phaser.Group, map: Phaser.Tilemap): void {
            if (this.objectsGroup) {
                Logger.warn('OttersideGameManager', `Objects already created`);
                return;
            }
            this.objectsGroup = group;

            if (!map.objects[MapUtils.OBJECT_LAYER_NAME]) {
                window.console.log('CreateFromObjects: No Objectsgroup with name ' + MapUtils.OBJECT_LAYER_NAME + ' found.');

                return;
            }

            map.objects[MapUtils.OBJECT_LAYER_NAME].forEach((object: GameObject<GameObjectProperties>) => {
                if (object.properties.spriteIndex && !this.isHidden(object)) {
                    this.prepareSpriteIndex(object);
                    object.sprite = this.createSpriteForObject(object);

                    if (object.properties.moveable !== 'true') {
                        object.sprite.body.immovable = true;
                    }
                }
            });
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
                    if (door.sprite) {
                        door.sprite.kill();
                        this.getOrCreateGameObjectState(door.name).deleted = true;
                    }
                });

                this.save();
                this.minimap.updateObjects();
            }
        }

        public finishRiddle(): void {
            var riddleState = this.getOrCreateRiddleState(this.currentRiddle);

            //Already finsihed. Nothing to do here.
            if (riddleState.finished) {
                return;
            }

            riddleState.finished = true;
            this.save();

            let terminal = MapUtils.findObjects(this.map, (object) => {
                return object.type === 'terminal' && object.name === this.currentRiddle;
            }, true)[0];

            if (!terminal) {
                Logger.error('OttersideGameManager', `Terminal ${this.currentRiddle} not found.`);
            }
            else {
                terminal.actualSpriteIndex = terminal.actualSpriteIndex + 1;
                terminal.sprite.kill();
                terminal.sprite = this.createSpriteForObject(terminal);
                this.minimap.updateObjects();
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

        /**
         * Checks if the RiddleState for the given riddleName exists and returns it.
         * If no state exists a new one will be created and added to the SaveGame;
         * @param {string} riddleName The riddles name
         * @return {savegame.RiddleState} The saved state for the riddle.
         */
        private getOrCreateRiddleState(riddleName: string): savegame.RiddleState {
            if (!this.saveGame.riddleState) {
                this.saveGame.riddleState = {};
            }

            var riddleState = this.saveGame.riddleState[riddleName];

            if (!riddleState) {
                riddleState = {};
                this.saveGame.riddleState[riddleName] = riddleState;
            }

            return riddleState;
        }

        public save(): void {
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

        private isHidden(gameObject: GameObject<GameObjectProperties>): boolean {
            if (!this.saveGame.gameObjectState || !this.saveGame.gameObjectState[gameObject.name]) {
                return false;
            }
            else {
                return this.saveGame.gameObjectState[gameObject.name].deleted;
            }
        }

        private createSpriteForObject(gameObject: GameObject<GameObjectProperties>): Phaser.Sprite {
            return this.objectsGroup.create(gameObject.x, gameObject.y, 'ottersideTiles', gameObject.actualSpriteIndex - 1)
        }

        private prepareSpriteIndex(gameObject: GameObject<GameObjectProperties>): void {
            let spriteIndex = parseInt(gameObject.properties.spriteIndex);

            if (gameObject.type === 'terminal' && this.saveGame.riddleState
                && this.saveGame.riddleState[gameObject.name]
                && this.saveGame.riddleState[gameObject.name].finished) {
                gameObject.actualSpriteIndex = spriteIndex + 1;
            }
            else {
                gameObject.actualSpriteIndex = spriteIndex;
            }
        }
    }

    export var gameManager: OttersideGameManager = new OttersideGameManager();
}
