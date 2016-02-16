namespace otterside.console {

    /**
     * The core of the console that supports command execution and autocomplete.
     */
    export class ConsoleEngine {
        private commands: { [command: string]: CommandExecutor };

        constructor(private console: Console) {
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

            if (parsedCommand.command === 'help') {
                this.showHelp(parsedCommand);

                return {
                    state: CommandExecutionState.Success,
                    command: parsedCommand
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
                    state: CommandExecutionState.Success,
                    command: parsedCommand
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

        private showHelp(parsedCommand: ParsedCommand): void {
            if (!parsedCommand.arguments || parsedCommand.arguments.length === 0) {

                this.console.printLine('Parameters are shown with _emphasis_. Optional parameters in [_square brackets_]')

                for (let commandName of this.getCommandNamesOrdered()) {
                    let commandExecutor = this.commands[commandName];

                    this.console.printLine(commandExecutor.help(false));
                }
            }
            else {
                var commandName = parsedCommand.arguments[0];
                var command = this.commands[commandName];

                if (!command) {
                    this.console.printLine(`Command **${commandName}** not found!`);
                }
                else {
                    this.console.printLine(command.help(true));
                }
            }
        }

        private getCommandNamesOrdered(): string[] {
            return Object.keys(this.commands).sort();
        }
    }

    class CommandExecutor {
        private handler: any;
        private command: Command;

        constructor(command: Command, handler: CommandHandler) {
            this.command = command;
            this.handler = handler;
        }

        public execute(parsedCommand: ParsedCommand): void {
            var context = {
                arguments: parsedCommand.arguments
            };

            if (typeof this.handler === 'function') {
                this.handler(context);
            } else {
                this.handler.executeCommand(context);
            }
        }

        /**
         * Prints the help text for the command.
         * @param  {boolean} extended if true informations for all parameters will be added.
         * @return {string}           the help text.
         */
        public help(extended: boolean): string {
            var helpText = `**${this.command.command} ${this.commandParamsToString()} **- ${this.command.helpText}`

            if (extended && this.command.params && this.command.params.length > 0) {
                helpText += '\n\n### Arguments\n';

                helpText += this.command.params.map((param) => {
                    let paramHelpText = '';

                    if (param.required) {
                        paramHelpText += `**${param.name}**`;
                    }
                    else {
                        paramHelpText += `**[${param.name}]**`;
                    }

                    paramHelpText += ` - ${param.helpText}`;

                    return paramHelpText;
                }).join('\n\n');
            }

            return helpText;
        }

        private commandParamsToString(): string {
            if (!this.command.params || this.command.params.length === 0) {
                return '';
            }

            return this.command.params.map((param) => {
                if (param.required) {
                    return `_${param.name}_`;
                }
                else {
                    return `[_${param.name}_]`;
                }
            }).join(' ');
        }
    }
}
