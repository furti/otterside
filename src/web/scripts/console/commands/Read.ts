namespace otterside.console.command {
    /**
     * Command to read a file.
     */
    export class Read {
        private reader: Reader;

        public static command: console.Command = {
            command: 'read',
            helpText: 'Shows the content of a file.',
            arguments: [{
                name: 'file',
                required: true,
                helpText: 'The name of the file to show.'
            }]
        };

        private console: Console;

        constructor(console: Console) {
            this.console = console;
        }

        public quit(): void {
            this.console.closeCurrentContext();
        }

        public executeCommand(context: console.CommandExecutionContext): void {
            if (!context.arguments) {
                this.console.printLine('a filename argument is required. use **read filename** to read a file.');
                return;
            }

            var fileName = context.arguments['file'] as string;

            var file = this.console.getFile(fileName);

            if (!file) {
                this.console.printLine(`File **${fileName}** not found.`);
                return;
            }

            if (file.ext === '.md') {
                this.reader = new console.command.read.MarkdownReader(file, this.console);
            }
            else {
                throw `File ending ${file.ext} not supported yet`;
            }

            var consoleContext = this.console.startContext({
                showInput: true
            });

            this.registerCommands(consoleContext);
            this.reader.performRead();
        }

        public autocomplete(argumentName: string): string[] {
            if (argumentName === 'file') {
                var files = this.console.getFiles();

                if (!files) {
                    return [];
                }

                return files.map((file) => {
                    return file.base;
                });
            }

            return [];
        }

        private registerCommands(consoleContext: console.ConsoleContext): void {
            consoleContext.registerCommand({
                command: 'quit',
                helpText: 'Close the current file.'
            }, (context) => this.quit());
        }
    }

    export abstract class Reader {
        private file: ConsoleFile;
        protected console: Console;

        constructor(file: ConsoleFile, console: Console) {
            this.file = file;
            this.console = console;
        }

        protected getContent(): string {
            return utils.Base64.decode(this.file.content);
        }

        public abstract performRead(): void;
    }
}
