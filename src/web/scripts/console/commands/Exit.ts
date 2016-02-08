namespace otterside.console.command {
    /**
     * Command to read a file.
     */
    export class Exit {
        private reader: Reader;

        public static command: console.Command = {
            command: 'exit'
        };

        private console: Console;

        constructor(console: Console) {
            this.console = console;
        }

        public executeCommand(context: console.CommandExecutionContext): void {
            this.console.close();
        }
    }
}
