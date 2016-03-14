namespace read1.open {
    export function run(commandParams: otterside.CommandParams): void {
        if (!commandParams.arguments || !commandParams.arguments['password']) {
            commandParams.console.printLine('You need a password to open the door.');
        }
        else if (commandParams.arguments['password'] === 'easy-peasy') {
            commandParams.gameManager.openDoor();
            commandParams.gameManager.finishRiddle();
        }
        else {
            commandParams.console.printLine('You entered the wrong password.');
        }
    }
}
