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
            this.console.start().then(() => {
                this.game.state.start(PlayState.stateName);
            });
        }
    }
}
