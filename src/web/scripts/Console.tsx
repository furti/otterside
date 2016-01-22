module Otterside {

    /**
     * The Console that is used for interacting with the user.
     *
     * Use the load method to load the content for the console.
     */
    export class Console implements InteractiveComponent {
        private consoleView: ConsoleView;
        private contentLoaded: Q.Promise<void>;
        private consoleDeferred: Q.Deferred<Console>;
        private consoleName: string;
        private running: boolean;

        /**
         * Constructs a new console with the given name.
         * @param  {string} consoleName The name of the console is used to load the content for the console from the server. The URL constructed is /console/<consoleName>.
         * @return {Console}            The Console.
         */
        constructor(consoleName: string) {
            this.consoleName = consoleName;
        }

        /**
         * This method displays the console. This method can safely be called at any time.
         * It waits until the data is loaded and starts to display its content then.
         *
         * The Returned promise will be resolved when the console is ready for use.
         *
         * If the console is already running, the deferred will be returned.
         *
         * @return {Q.Promise<void>} the promise that gets resolved when the console is shown.
         */
        public start(): Q.Promise<Console> {
            if (this.running) {
                return this.consoleDeferred.promise;
            }

            this.consoleDeferred = Q.defer<Console>();
            this.running = true;

            this.show();
            this.contentLoaded.then(() => {
                this.consoleDeferred.resolve(this);
            });

            return this.consoleDeferred.promise;
        }

        /**
         * Loads the content for the console.
         *
         * The promise will be resolved when the content was loaded successfull.
         * If an Error occurs the promise will be rejected.
         *
         * @return {Q.Promise<void>} a promise for checking the loading state.
         */
        public load(): Q.Promise<void> {
            var path = '/console/' + this.consoleName;

            var contentLoadDefered = Q.defer<void>();
            this.contentLoaded = contentLoadDefered.promise;

            //TODO: load content from server instead of dummy timeout
            window.setTimeout(() => {
                contentLoadDefered.resolve();
            }, 500);

            return this.contentLoaded;
        }

        /**
         * Prints a line on the console.
         * @param {string} line the text to print to the console
         */
        public printLine(line: string): void {
            this.consoleView.addLine(line);
        }

        /**
         * Maximizes the console.
         */
        public maximize(): void {
            InteractiveContent.contentComponent.maximize();
        }

        /**
         * Displays the console on the screen and sets up all event handlers.
         *
         * It also displays the Text Loading... until the content is loaded.
         */
        private show(): void {
            InteractiveContent.contentComponent.activateComponent(this);
        }

        private connectConsoleView(consoleView: ConsoleView): void {
            this.consoleView = consoleView;
        }

        public render(): JSX.Element {
            return <ConsoleView ref={(consoleView) => {
                this.connectConsoleView(consoleView);
            } }>
            </ConsoleView>;
        }
    }

    /**
     * The visual representation of the console.
     */
    class ConsoleView extends React.Component<{}, ConsoleViewState> {
        private textarea: ResizeableTextArea;

        constructor() {
            super();

            this.state = {
                lines: []
            };
        }

        addLine(line: string): void {
            this.state.lines.push(line);

            this.setState({
                lines: this.state.lines
            });
        }

        /**
         * Set The focus to the command input
         */
        public focusInput(): void {
            this.textarea.focus();
        }

        private handleInput(e: React.FormEvent): void {
            var textarea = e.target as HTMLTextAreaElement;
            console.log(textarea.value);
        }

        render() {
            return <div className="console" onClick={(e) => this.focusInput() }>
                <div className="console-lines">
                    {
                        this.state.lines.map((line, index) => {
                            return <p key={"line-" + index} className="console-line">{line}</p>
                        })
                    }
                </div>
                <div className="console-input">
                    <span className="prompt">$</span>
                    <ResizeableTextArea onChange={(event) => this.handleInput(event) } ref={(textarea) => this.textarea = textarea}></ResizeableTextArea>
                </div>
            </div>
        }
    }

    class ResizeableTextArea extends React.Component<ResizeableTextAreaProps, ResizeableTextAreaState> {
        private textarea: HTMLTextAreaElement;

        constructor() {
            super();
        }

        /**
         * Set the focus on the textarea;
         */
        public focus(): void {
            this.textarea.focus();
        }

        private handleChange(e: React.FormEvent): void {
            this.checkResize(e);
            this.props.onChange(e);
        }

        private checkResize(e: React.FormEvent): void {
            var textarea = e.target as HTMLTextAreaElement;
            textarea.style.minHeight = '0'; //At first reset the min height so that scroll height is computed right
            textarea.style.minHeight = textarea.scrollHeight + 'px';
        }

        render(): JSX.Element {
            return <textarea rows={1} onChange={(e) => this.checkResize(e) } ref={(textarea) => this.textarea = textarea}></textarea>
        }
    }

    interface ConsoleViewState {
        lines: string[];
    }

    interface ResizeableTextAreaProps extends React.Props<ResizeableTextArea> {
        onChange: (e: React.FormEvent) => void
    }

    interface ResizeableTextAreaState { }
}
