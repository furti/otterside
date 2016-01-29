module Otterside {
    export interface Command {
        /**
         * The string the user must enter to execute this command.
         * @type {[type]}
         */
        command: string;
    }

    export interface CommandExecutionContext {

    }

    declare type CommandHandler = ((context: CommandExecutionContext) => void);

    class Executor {
        private handler: (context: CommandExecutionContext) => void;
        private command: Command;

        constructor(command: Command, handler: CommandHandler) {
            this.command = command;
            this.handler = handler;
        }
    }

    /**
     *
     */
    export class ConsoleEngine {

        private commands: { [command: string]: Executor };

        constructor() {
            this.commands = {};
        }

        /**
         * Add a command to the engine. The handler will be called with the specified parameters and options when the command is executed.
         * @param  {Command}                 command the command
         * @param  {CommandExecutionContext} handler the handler to execute
         */
        public registerCommand(command: Command, handler: CommandHandler): void {
            this.commands[command.command] = new Executor(command, handler);
        }

        /**
         * Parses the given commandString and executes the associated command
         * @param {string} commandString the command to parse
         */
        public execute(commandString: string): void {
            console.log(commandString);
        }
    }
}
