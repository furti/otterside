namespace otterside.console {
    export type AutocompleteHandler = ((argumentName: string) => string[]) | { autocomplete: (argumentName: string) => string[] };
}
