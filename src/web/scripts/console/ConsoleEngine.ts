namespace otterside.console {

    /**
     *
     */
    export class ConsoleEngine {

        private commands: { [command: string]: CommandExecutor };

        constructor() {
            this.commands = {};
        }

        /**
         * Add a command to the engine. The handler will be called with the specified parameters and options when the command is executed.
         * @param  {Command}                 command the command
         * @param  {CommandExecutionContext} handler the handler to execute
         */
        public registerCommand(command: Command, handler: CommandHandler): void {
            this.commands[command.command] = new CommandExecutor(command, handler);
        }

        /**
         * Parses the given commandString and executes the associated command
         * @param {string} commandString the command to parse
         */
        public execute(commandString: string): void {
            window.console.log(commandString);
        }
    }

    class CommandExecutor {
        private handler: (context: CommandExecutionContext) => void;
        private command: Command;

        constructor(command: Command, handler: CommandHandler) {
            this.command = command;
            this.handler = handler;
        }
    }
}
