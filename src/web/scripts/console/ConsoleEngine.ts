namespace otterside.console {

    /**
     * The core of the console that supports command execution and autocomplete.
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
        public execute(commandString: string): CommandExecutionResult {
            if (!commandString) {
                return;
            }

            var parsedCommand = this.parseCommand(commandString);

            if (!parsedCommand) {
                return {
                    state: CommandExecutionState.Error,
                    message: `Command **${commandString}** could not be parsed`
                };
            }

            if (!this.commands[parsedCommand.command]) {
                return {
                    state: CommandExecutionState.Error,
                    message: `**${commandString}:** command not found`
                };
            }

            try {
                this.commands[parsedCommand.command].execute(parsedCommand);

                return {
                    state: CommandExecutionState.Success
                };
            }
            catch (e) {
                return {
                    state: CommandExecutionState.Error,
                    message: e.toString()
                };
            }
        }

        private parseCommand(commandString: string): ParsedCommand {
            var parts = commandString.trim().split(/\s+/);

            if (parts.length === 0) {
                return;
            }

            return {
                command: parts[0],
                arguments: parts.length > 1 ? parts.slice(1) : undefined
            }
        }
    }

    interface ParsedCommand {
        command: string;
        arguments?: any[];
    }

    class CommandExecutor {
        private handler: (context: CommandExecutionContext) => void;
        private command: Command;

        constructor(command: Command, handler: CommandHandler) {
            this.command = command;
            this.handler = handler;
        }

        public execute(parsedCommand: ParsedCommand): void {
            this.handler({
                arguments: parsedCommand.arguments
            });
        }
    }
}
