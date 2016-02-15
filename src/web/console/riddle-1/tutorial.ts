namespace riddle1.tutorial {
    class TutorialStateManager {
        constructor(private console: otterside.Console) {
            this.console.on.commandExecuted((event: otterside.CommandExecutedEvent) => {
                this.commandExecuted(event);
            });
        }

        public start(): void {
            this.console.printFile('tutorial-1.md');
        }

        public commandExecuted(event: any): void {
            window.console.log(event);
        }
    }

    export function run(commandParams: otterside.CommandParams): void {
        let stateManager = new TutorialStateManager(commandParams.console);
        stateManager.start();
    }
}
