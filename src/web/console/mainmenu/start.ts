module MainMenu {
    export function run(commandParams: Otterside.CommandParams): void {
        //Simply start a new game when the start command is called.
        commandParams.game.state.start(Otterside.PlayState.stateName);
    }
}
