namespace mainmenu.start {
    export function run(commandParams: otterside.CommandParams): void {
        commandParams.console.close();
        //Close the console and start a new game when the start command is called.
        commandParams.game.state.start(commandParams.gameStates.PlayState);
    }
}
