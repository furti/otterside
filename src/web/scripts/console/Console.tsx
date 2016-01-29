module Otterside {

    /**
     * The Console that is used for interacting with the user.
     *
     * Use the load method to load the content for the console.
     */
    export class Console implements InteractiveComponent {
        private consoleView: ConsoleView;
        private contentLoaded: Q.Promise<ConsoleContent>;
        private consoleDeferred: Q.Deferred<Console>;
        private consoleName: string;
        private running: boolean;
        private content: ConsoleContent;
        private consoleEngine: ConsoleEngine;

        /**
         * Constructs a new console with the given name.
         * @param  {string} consoleName The name of the console is used to load the content for the console from the server. The URL constructed is /console/<consoleName>.
         * @return {Console}            The Console.
         */
        constructor(consoleName: string) {
            this.consoleName = consoleName;
            this.consoleEngine = new ConsoleEngine();
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

            this.load();
            this.consoleDeferred = Q.defer<Console>();
            this.running = true;

            this.show();
            this.contentLoaded.then((consoleContent) => {
                this.content = consoleContent;

                this.printWelcome();
                this.registerExecutables();

                this.consoleDeferred.resolve(this);
            }, (errorMessage: string) => {
                this.printLine(errorMessage);
                this.consoleDeferred.reject(this);
            });

            return this.consoleDeferred.promise;
        }

        /**
         * Loads the content for the console.
         */
        private load(): void {
            var path = '/console/' + this.consoleName + '/content.json';

            var contentLoadDefered = Q.defer<ConsoleContent>();
            this.contentLoaded = contentLoadDefered.promise;

            Http.get<ConsoleContent>(path)
                .execute()
                .then((response: ConsoleContent) => {
                    contentLoadDefered.resolve(response);
                }, (errorMessage: string) => {
                    contentLoadDefered.reject(errorMessage);
                });
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
         * Prints the welcome text if available.
         */
        private printWelcome(): void {
            if (this.content.welcome) {
                this.printLine(Utils.Base64.decode(this.content.welcome));
            }
        }

        /**
         * Iterate over all executables and register them on the ConsoleEngine;
         * @return {[type]} [description]
         */
        private registerExecutables(): void {
            if (this.content.executables) {
                for (let executable of this.content.executables) {
                    this.consoleEngine.registerCommand(executable, (context: CommandExecutionContext) => {
                        //TODO: execute script
                        console.log(context);
                    });
                }
            }
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
            } }
                onExecute={(commandString) => this.consoleEngine.execute(commandString) }>
            </ConsoleView>;
        }
    }

    /**
     * Contains all the files and folders for a console instance.
     */
    interface ConsoleContent {
        /**
         * Markdown String that should be shown on startup.
         */
        welcome?: string;

        /**
         * List of Executable scripts for the console.
         *
         * @type {Executable}
         */
        executables: Executable[];

        /**
         * All files contained in the console;
         * @type {ConsoleFile}
         */
        files: { [fileName: string]: ConsoleFile };
    }

    interface Executable extends Command {
        /**
         * The file that should be executed by this command.
         * @type {[type]}
         */
        file: string;
    }

    interface ConsoleFile {
        /**
         * The files content
         */
        content: string;
        /**
         * The files name without extension.
         */
        name: string;
        /**
         * The files extension
         */
        ext: string;
        /**
         * The filename + extension.
         */
        base: string;

        readonly: boolean;

        executable: boolean;
    }

    /**
     * The visual representation of the console.
     */
    class ConsoleView extends React.Component<ConsoleViewProps, ConsoleViewState> {
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

        private handleUp(e: React.KeyboardEvent): void {
            var textarea = e.target as HTMLTextAreaElement;

            if (e.keyCode === 13) {
                //Enter pressed --> execute the command
                this.props.onExecute(textarea.value);
                textarea.value = '';
            }
        }

        private handleDown(e: React.KeyboardEvent): void {
            //Prevent the default action on enter or tab. We don't want a newline in the textarea nor we want the focus to be lost.
            if (e.keyCode === 13 || e.keyCode === 9) {
                e.preventDefault();
            }
        }

        render() {
            return <div className="console" onClick={(e) => this.focusInput() }>
                <div className="console-lines">
                    {
                        this.state.lines.map((line, index) => {
                            return <MarkdownParagraph key={"line-" + index} markdownContent={line} className="console-line"></MarkdownParagraph>
                        })
                    }
                </div>
                <div className="console-input">
                    <span className="prompt">$</span>
                    <ResizeableTextArea onKeyUp={(event) => this.handleUp(event) } onKeyDown={(event) => this.handleDown(event) } ref={(textarea) => this.textarea = textarea}>
                    </ResizeableTextArea>
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

        private setupTextarea(textarea: HTMLTextAreaElement): void {
            if (!this.textarea) {
                this.textarea = textarea;
                // textarea.addEventListener('keydown', function(event) {
                //     console.log(event.target);
                //     event.preventDefault();
                //     return false;
                // });
            }
        }

        private handleChange(e: React.FormEvent): void {
            this.checkResize(e);
        }

        private checkResize(e: React.FormEvent): void {
            var textarea = e.target as HTMLTextAreaElement;
            textarea.style.minHeight = '0'; //At first reset the min height so that scroll height is computed right
            textarea.style.minHeight = textarea.scrollHeight + 'px';
        }

        render(): JSX.Element {
            return <textarea rows={1} onKeyUp={this.props.onKeyUp} onKeyDown={this.props.onKeyDown}
                ref={(textarea) => this.setupTextarea(textarea) }></textarea>
        }
    }

    interface ConsoleViewProps extends React.Props<ConsoleView> {
        onExecute?: (commandString: string) => void;
        onAutocomplete?: (commandString: string) => string;
    }

    interface ConsoleViewState {
        lines: string[];
    }

    interface ResizeableTextAreaProps extends React.Props<ResizeableTextArea> {
        onKeyUp: (event: React.KeyboardEvent) => void;
        onKeyDown?: (event: React.KeyboardEvent) => void;
    }

    interface ResizeableTextAreaState { }
}
