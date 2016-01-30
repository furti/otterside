namespace otterside {
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
            }, (console: Console) => {
                Loading.hide();
                this.console.maximize();
            });
        }
    }
}
