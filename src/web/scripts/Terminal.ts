namespace otterside {
    export class Terminal {
        private console: Console;
        private riddleName: string;

        constructor(private object: GameObject<GameObjectProperties>, private keyboard: Phaser.Keyboard) {
            this.console = new Console(object.properties.riddle);
            this.riddleName = object.properties.riddle;
        }

        public connect(): Q.Promise<void> {
            var defered = Q.defer<void>();

            otterside.gameManager.startRiddle(this.riddleName);

            this.console.start().finally(() => {
                this.console.maximize();
            });

            this.console.on.close(() => {
                otterside.gameManager.stopCurrentRiddle();
                defered.resolve();
            });

            return defered.promise;
        }
    }
}
