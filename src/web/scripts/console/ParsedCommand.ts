namespace otterside {
    export interface ParsedCommand {
        command: string;
        arguments?: { [name: string]: any };
    }
}
