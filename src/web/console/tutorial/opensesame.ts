namespace tutorial.finish {
    export function run(commandParams: otterside.CommandParams): void {
        commandParams.gameManager.openDoor();
        commandParams.gameManager.finishRiddle();
        commandParams.console.close();
    }
}
