namespace otterside.console {
    export interface ConsoleViewProps extends React.Props<otterside.console.ConsoleView> {
        onExecute?: (commandString: string) => void;
        onAutocomplete?: (commandString: string) => string;
        context: console.ConsoleContext;
    }
}
