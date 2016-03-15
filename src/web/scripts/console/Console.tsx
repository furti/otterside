namespace otterside {

    export const enum ConsoleEvent {
        CLOSE = 1,
        COMMAND_EXECUTED = 2
    }

    export class ConsoleEventRegistrar {
        constructor(private events: Events) {

        }

        public commandExecuted(handler: (event?: ParsedCommand) => void): void {
            this.events.on(ConsoleEvent.COMMAND_EXECUTED, handler);
        }

        public close(handler: () => void): void {
            this.events.on(ConsoleEvent.CLOSE, handler);
        }
    }

    /**
     * The Console that is used for interacting with the user.
     *
     * Use the load method to load the content for the console.
     */
    export class Console implements InteractiveComponent {
        private consoleView: console.ConsoleView;
        private contentLoaded: Q.Promise<ConsoleContent>;
        private consoleConnected: Q.Deferred<void>;
        private consoleDeferred: Q.Deferred<Console>;
        private consoleName: string;
        private running: boolean;
        private content: ConsoleContent;
        private contexts: console.ConsoleContext[];
        public events: Events;
        public on: ConsoleEventRegistrar;

        /**
         * Constructs a new console with the given name.
         * @param  {string} consoleName The name of the console is used to load the content for the console from the server. The URL constructed is /console/<consoleName>.
         * @return {Console}            The Console.
         */
        constructor(consoleName: string) {
            this.consoleName = consoleName;
            this.contexts = [];
            this.events = new Events();
            this.on = new ConsoleEventRegistrar(this.events);
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

            Q.all<any>([this.contentLoaded, this.consoleConnected.promise]).finally(() => {
                this.startContext({
                    showInput: true
                });

                this.registerDefaultCommands();
            }).then((resolvedData: any[]) => {
                this.content = resolvedData[0];
                this.registerExecutables();
                this.printWelcome();
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

        public getFile(fileName: string): ConsoleFile {
            return this.content.files[fileName];
        }

        /**
         * Returns a list of all files inside the console.
         * @return {ConsoleFile[]} List of files
         */
        public getFiles(): ConsoleFile[] {
            if (!this.content.files) {
                return [];
            }

            var files: ConsoleFile[] = [];

            for (let fileName of Object.getOwnPropertyNames(this.content.files)) {
                files.push(this.content.files[fileName]);
            }

            return files;
        }

        /**
         * Prints a line on the console.
         * @param {string} line the text to print to the console
         */
        public printLine(line: string): void {
            this.getCurrentContext().lines.push(line);
            this.rerenderView();
            this.consoleView.scrollBottom();
        }

        public printFile(fileName: string): void {
            var file = this.getFile(fileName);

            if (file) {
                this.printLine(utils.Base64.decode(file.content));
            }
            else {
                this.printLine(`File ${fileName} not found!`);
            }
        }

        public scrollTop(): void {
            this.consoleView.scrollTop();
        }

        /**
         * Maximizes the console.
         */
        public maximize(): void {
            InteractiveContent.contentComponent.maximize();
        }

        public close(): void {
            this.events.fire(ConsoleEvent.CLOSE);

            InteractiveContent.contentComponent.disableActiveComponent();
        }

        public startContext(config: console.ConsoleContextConfig): console.ConsoleContext {
            var newContext = new console.ConsoleContext(this.contexts.length, this, config);

            this.contexts.push(newContext);
            this.setCurrentContext();

            return newContext;
        }

        /**
         * Removes the current context from the stack and renders the previous context.
         * The default context cannot be removed.
         */
        public closeCurrentContext(): void {
            if (this.contexts.length > 1) {
                this.contexts.pop();
                this.setCurrentContext();
            }
        }

        private rerenderView(): void {
            if (this.consoleView) {
                this.consoleView.forceUpdate();
                this.consoleView.focusInput();
            }
        }

        private setCurrentContext(): void {
            this.consoleView.setContext(this.getCurrentContext());
            this.rerenderView();
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
                var currentContext = this.getCurrentContext();

                for (let executable of this.content.executables) {
                    currentContext.registerCommand(executable,
                        new console.ConsoleExecutableHandler(this, executable));
                }
            }
        }

        private registerDefaultCommands(): void {
            var currentContext = this.getCurrentContext();

            var read = new console.command.Read(this);
            currentContext.registerCommand(console.command.Read.command, read, read);
            currentContext.registerCommand(console.command.Exit.command, new console.command.Exit(this));
            currentContext.registerCommand(console.command.List.command, new console.command.List(this));
        }

        /**
         * Displays the console on the screen and sets up all event handlers.
         *
         * It also displays the Text Loading... until the content is loaded.
         */
        private show(): void {
            this.consoleConnected = Q.defer<void>();

            InteractiveContent.contentComponent.activateComponent(this);
        }

        private connectConsoleView(consoleView: console.ConsoleView): void {
            if (consoleView) {
                this.consoleView = consoleView;
                this.consoleView.focusInput();
                this.consoleConnected.resolve();
            }
        }

        public render(): JSX.Element {
            return <console.ConsoleView ref={(consoleView) => {
                this.connectConsoleView(consoleView);
            } }>
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

    export interface ConsoleFile {
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

        readable: boolean;
        writeable: boolean;
        executable: boolean;
    }
}
