namespace otterside {

    export class MainMenuState extends Phaser.State {
        public static stateName = 'MainMenu';

        public preload() {
            MainMenuConsole.createConsole();
        }

        public create() {
            MainMenuConsole.start();
        }

        public shutdown() {
            MainMenuConsole.clear();
        }
    }

    class MainMenuConsole {
        private static console: Console;

        public static createConsole(): void {
            this.console = new Console('mainmenu');
        }

        public static start(): void {
            this.console.start().then((console: Console) => {
                Loading.hide();
                this.console.maximize();
            }, (console: Console) => {
                Loading.hide();
                this.console.maximize();
            });
        }

        public static clear(): void {
            this.console = undefined;
        }
    }

    HotKeys.registerHotkey(Key.ESC, (event) => {
        if (!InteractiveContent.contentComponent.isComponentActive()) {
            MainMenuConsole.createConsole();
            MainMenuConsole.start();
        }

        return true;
    });
}
