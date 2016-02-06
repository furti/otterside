namespace otterside {

    /**
     * The Console that is used for interacting with the user.
     *
     * Use the load method to load the content for the console.
     */
    export class Console implements InteractiveComponent {
        private consoleView: console.ConsoleView;
        private contentLoaded: Q.Promise<ConsoleContent>;
        private consoleDeferred: Q.Deferred<Console>;
        private consoleName: string;
        private running: boolean;
        private content: ConsoleContent;
        private consoleEngine: console.ConsoleEngine;
        private contexts: console.ConsoleContext[];

        /**
         * Constructs a new console with the given name.
         * @param  {string} consoleName The name of the console is used to load the content for the console from the server. The URL constructed is /console/<consoleName>.
         * @return {Console}            The Console.
         */
        constructor(consoleName: string) {
            this.consoleName = consoleName;
            this.consoleEngine = new console.ConsoleEngine();
            this.contexts = [];
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

            this.startContext();
            this.show();
            this.contentLoaded.then((consoleContent) => {
                this.content = consoleContent;

                this.printWelcome();
                this.registerExecutables();
                this.registerDefaultCommands();

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

        public getFile(fileName: string) {
            return this.content.files[fileName];
        }
        /**
         * Prints a line on the console.
         * @param {string} line the text to print to the console
         */
        public printLine(line: string): void {
            this.getCurrentContext().lines.push(line);
            this.rerenderView();
        }

        /**
         * Maximizes the console.
         */
        public maximize(): void {
            InteractiveContent.contentComponent.maximize();
        }

        public close(): void {
            InteractiveContent.contentComponent.disableActiveComponent();
        }

        public startContext(): void {
            this.contexts.push(new console.ConsoleContext());
            this.rerenderView();
        }

        /**
         * Removes the current context from the stack and renders the previous context.
         * The default context cannot be removed.
         */
        public closeCurrentContext(): void {
            if (this.contexts.length > 1) {
                this.contexts.pop();
                this.rerenderView();
            }
        }

        private rerenderView(): void {
            if (this.consoleView) {
                this.consoleView.forceUpdate();
                this.consoleView.focusInput();
            }
        }

        private getCurrentContext(): console.ConsoleContext {
            return this.contexts[this.contexts.length - 1];
        }

        /**
         * Prints the welcome text if available.
         */
        private printWelcome(): void {
            if (this.content.welcome) {
                this.printLine(utils.Base64.decode(this.content.welcome));
            }
        }

        /**
         * Iterate over all executables and register them on the ConsoleEngine;
         * @return {[type]} [description]
         */
        private registerExecutables(): void {
            if (this.content.executables) {
                for (let executable of this.content.executables) {
                    this.consoleEngine.registerCommand(executable,
                        new console.ConsoleExecutableHandler(this, executable));
                }
            }
        }

        private registerDefaultCommands(): void {
            this.consoleEngine.registerCommand(console.command.Read.command, new console.command.Read(this));
        }

        public executeCommand(commandString: string): void {
            var result = this.consoleEngine.execute(commandString)

            if (result.state === console.CommandExecutionState.Error) {
                this.printLine(result.message);
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

        private connectConsoleView(consoleView: console.ConsoleView): void {
            if (consoleView) {
                this.consoleView = consoleView;
                this.consoleView.focusInput();
            }
        }

        public render(): JSX.Element {
            return <console.ConsoleView ref={(consoleView) => {
                this.connectConsoleView(consoleView);
            } }
                onExecute={(commandString) => this.executeCommand(commandString) }
                context={this.getCurrentContext() }>
            </console.ConsoleView >;
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

    export interface Executable extends console.Command {
        /**
         * The file that should be executed by this command.
         * @type {[type]}
         */
        file: string;

        /**
         * The name of the namespace that contains the run function.
         * @type {[type]}
         */
        runNamespace: string;
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
}
