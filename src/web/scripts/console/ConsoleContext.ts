namespace otterside.console {
    export interface ConsoleContextConfig {
        showInput: boolean;
    }

    export class ConsoleContext {

        public lines: string[];
        public id: number;
        public config: ConsoleContextConfig;
        private consoleEngine: console.ConsoleEngine;
        private console: Console;

        constructor(id: number, connectedConsole: Console, config: ConsoleContextConfig) {
            this.lines = [];
            this.id = id;
            this.config = config;
            this.consoleEngine = new console.ConsoleEngine(connectedConsole);
            this.console = connectedConsole;
        }

        public registerCommand(command: console.Command, handler: CommandHandler): void {
            this.consoleEngine.registerCommand(command, handler);
        }

        public executeCommand(commandString: string): void {
            var result = this.consoleEngine.execute(commandString)

            if (result.state === console.CommandExecutionState.Error) {
                this.console.printLine(result.message);
            }
        }
    }
}
