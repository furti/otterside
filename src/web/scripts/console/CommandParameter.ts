module otterside.console {
    export interface CommandParameter {
        name: string;
        required: boolean;
        helpText: string;
    }
}
