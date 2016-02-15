namespace otterside {
    export class Terminal {
        private console: Console;

        constructor(private object: GameObject<GameObjectProperties>, private keyboard: Phaser.Keyboard) {
            this.console = new Console(object.name);
        }

        public connect(): Q.Promise<void> {
            var defered = Q.defer<void>();

            this.console.start().finally(() => {
                this.console.maximize();
            });

            this.console.on.close(() => {
                defered.resolve();
            });

            return defered.promise;
        }
    }
}
