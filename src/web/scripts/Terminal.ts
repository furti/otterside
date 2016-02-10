namespace otterside {
    export class Terminal {
        private console: Console;

        constructor(private object: GameObject<GameObjectProperties>, private keyboard: Phaser.Keyboard) {
            this.console = new Console(object.name);
        }

        public connect(): void {
            this.keyboard.stop();

            this.console.start().finally(() => {
                this.console.maximize();
            });

            this.console.on(ConsoleEvent.CLOSE, () => {
                this.keyboard.start();
            });
        }
    }
}
