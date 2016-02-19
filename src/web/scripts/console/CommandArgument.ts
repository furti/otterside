module otterside.console {
    export interface CommandArgument {
        name: string;
        required: boolean;
        helpText: string;
    }
}
