namespace otterside.console {
    export type CommandHandler = ((context: CommandExecutionContext) => void) | { executeCommand: (context: CommandExecutionContext) => void };
}
