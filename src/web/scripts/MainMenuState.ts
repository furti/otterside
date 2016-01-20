module Otterside {
    export class MainMenuState extends Phaser.State {
        public static stateName = 'MainMenu';

        private console: Console;

        public preload() {
            this.console = new Console('mainmenu');

            this.console.load().then(() => {
                Loading.hide();
            });
        }

        public create() {
            this.console.start().then((console: Console) => {
                this.console.maximize();
                this.printWelcome(console);
                // this.game.state.start(PlayState.stateName);

            });
        }

        private printWelcome(console: Console): void {
            console.printLine('Hello dear Stranger!');
            console.printLine('Welcome to the Otterside.');
        }
    }
}
