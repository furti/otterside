namespace otterside.console {
    export enum CommandExecutionState {
        Success, Error
    }

    export interface CommandExecutionResult {
        state: CommandExecutionState;
        message?: string;
        command?: ParsedCommand;
    }
}
