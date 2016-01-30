namespace otterside.console {
    export interface ResizeableTextareaProps extends React.Props<ResizeableTextarea> {
        onKeyUp: (event: React.KeyboardEvent) => void;
        onKeyDown?: (event: React.KeyboardEvent) => void;
    }
}
