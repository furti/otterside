namespace otterside.console.command {
    /**
     * Command to read a file.
     */
    export class Read {
        public static command: console.Command = {
            command: 'read'
        };

        private console: Console;

        constructor(console: Console) {
            this.console = console;
        }

        public executeCommand(context: console.CommandExecutionContext): void {
            if (!context.arguments || context.arguments.length === 0) {
                this.console.printLine('a filename argument is required. use **read filename** to read a file.');
                return;
            }

            var fileName = context.arguments[0] as string;

            var file = this.console.getFile(fileName);

            if (!file) {
                this.console.printLine(`File **${fileName}** not found.`);
                return;
            }

            this.console.startContext({
                showInput: false
            });

            this.console.printLine(utils.Base64.decode(file.content));
            this.console.scrollTop();
        }
    }
}
