namespace otterside.console.command {
    /**
     * Command to list all available files.
     */
    export class List {
        public static command: console.Command = {
            command: 'list',
            helpText: 'List files inside the terminal.',
            arguments: [{
                name: 'all',
                required: false,
                helpText: 'Also shows hidden files if specified.'
            }]
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

            files = this.filterFiles(files, context.arguments);

            this.console.printLine(`Total **${files.length}** files`)

            files.forEach((file) => {
                this.console.printLine(this.printFile(file));
            });
        }

        private printFile(file: ConsoleFile): string {
            return `${this.readpermission(file)}${this.writepermission(file)}${this.executepermission(file)} ${file.name}${file.ext}`
        }

        private readpermission(file: ConsoleFile): string {
            return file.readable ? 'r' : '-';
        }

        private writepermission(file: ConsoleFile): string {
            return file.writeable ? 'w' : '-';
        }

        private executepermission(file: ConsoleFile): string {
            return file.executable ? 'e' : '-';
        }

        private filterFiles(files: ConsoleFile[], commandArgs?: { [name: string]: any }): ConsoleFile[] {
            //Also show hidden files if the users wants it
            if (commandArgs && commandArgs['all'] === 'all') {
                return files;
            }

            //Only show hidden files when the all option is specified
            return files.filter((file) => {
                return file.name.charAt(0) !== '.';
            });
        }
    }
}
