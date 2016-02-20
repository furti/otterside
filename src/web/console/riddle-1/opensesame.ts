namespace riddle1.finish {
    export function run(commandParams: otterside.CommandParams): void {
        commandParams.gameManager.openDoor();
        commandParams.console.close();
    }
}
