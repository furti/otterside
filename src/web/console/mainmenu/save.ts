namespace mainmenu.save {
    export function run(commandParams: otterside.CommandParams): void {
        commandParams.gameManager.save();
        commandParams.console.close();
    }
}
