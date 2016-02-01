module otterside.console {
    export class ConsoleExecutableHandler {
        private console: Console;
        private executable: Executable;

        constructor(console: Console, executable: Executable) {
            this.console = console;
            this.executable = executable;
        }
        public executeCommand(context: CommandExecutionContext): void {
            var file = this.console.getFile(this.executable.file);

            if (!file) {
                this.console.printLine(`Script **${this.executable.file}** not found.`);
                return;
            }

            var scriptContent = utils.Base64.decode(file.content);

            console.CodeEngine.run({
                scripts: [scriptContent],
                rootNamespace: this.executable.rootNamespace
            });
        }
    }
}
