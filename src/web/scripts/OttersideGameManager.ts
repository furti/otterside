namespace otterside {
    export var gameManager: OttersideGameManager;

    export class OttersideGameManager implements GameManager {
        private currentRiddle: string;

        constructor(private game: Phaser.Game, private map: Phaser.Tilemap) {

        }

        /**
         * initialize the game manager
         * @param  {Phaser.Game}    game The game
         * @param  {Phaser.Tilemap} map  The map is used to interact with the object layer.
         */
        public static initialize(game: Phaser.Game, map: Phaser.Tilemap): void {
            gameManager = new OttersideGameManager(game, map);
        }

        public startRiddle(riddleName: string) {
            this.currentRiddle = riddleName;
        }

        public stopCurrentRiddle(): void {
            delete this.currentRiddle;
        }

        public openDoor(): void {
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
                });
            }
        }
    }
}
