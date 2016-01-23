module Otterside {
    export class MainMenuState extends Phaser.State {
        public static stateName = 'MainMenu';

        private console: Console;

        public preload() {
            this.console = new Console('mainmenu');
        }

        public create() {
            this.console.start().then((console: Console) => {
                Loading.hide();
                this.console.maximize();
                this.printWelcome(console);
                this.printCommands(console);
            }, (console: Console) => {
                Loading.hide();
                this.console.maximize();
            });
        }

        private printWelcome(console: Console): void {
            console.printLine('Hello dear Stranger!');
            console.printLine('Welcome to the Otterside.');
            console.printLine('---');
        }

        private printCommands(console: Console): void {
            console.printLine('Type **start** to start a new game.');
        }
    }
}
