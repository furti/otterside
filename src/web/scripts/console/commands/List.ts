namespace otterside.console.command {
    /**
     * Command to list all available files.
     */
    export class List {
        public static command: console.Command = {
            command: 'list'
        };

        private console: Console;

        constructor(console: Console) {
            this.console = console;
        }

        public executeCommand(context: console.CommandExecutionContext): void {
            let files = this.console.getFiles();

            if (!files || files.length == 0) {
                this.console.printLine('There are no files in the terminal.');
            }

            files = this.filterFiles(files);

            this.console.printLine(`Total **${files.length}** files`)

            files.forEach((file) => {
                this.console.printLine(`${file.name}${file.ext}`);
            });
        }

        private filterFiles(files: ConsoleFile[]): ConsoleFile[] {
            //Only show hidden files when the all option is specified
            return files.filter((file) => {
                return file.name.charAt(0) !== '.';
            });
        }
    }
}
