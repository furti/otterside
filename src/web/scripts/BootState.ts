namespace otterside {
    /**
     * First State that is loaded by the game. Initializes some common functionality and starts the PreloadState.
     */
    export class BootState extends Phaser.State {
        public static stateName = 'Boot';

        public preload() {
            Loading.show();
            InteractiveContent.setupContent();
        }

        public create() {
            this.physics.startSystem(Phaser.Physics.ARCADE);

            //Set Background to white for loading
            this.game.stage.backgroundColor = '#fff';

            this.game.state.start(PreloadState.stateName);
        }
    }
}
