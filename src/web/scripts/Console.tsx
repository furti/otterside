module Otterside {

    /**
     * The Console that is used for interacting with the user.
     *
     * Use the load method to load the content for the console.
     */
    export class Console implements InteractiveComponent {
        private consoleView: ConsoleComponent;
        private contentLoaded: Q.Promise<void>;
        private consoleDeferred: Q.Deferred<void>;
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
         * This method displays the console. This method can safely be called at any time. It waits until the data is loaded and starts to display its content then.
         *
         * The Returned promise will be resolved by the console when the underlying engine is finished.
         * For Example when the player has solved a riddle the promise will be resolved.
         * If the User exits the console without solving the riddle the promis will be rejected.
         *
         * If the console is already running, the deferred will be returned and no further action is taken.
         *
         * @return {Q.Promise<void>} the promise that gets resolved by the console engine later.
         */
        public start(): Q.Promise<void> {
            if (this.running) {
                return this.consoleDeferred.promise;
            }

            this.consoleDeferred = Q.defer<void>();
            this.running = true;

            this.show();

            this.contentLoaded.then(() => {
                this.consoleDeferred.resolve();
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
         * Displays the console on the screen and sets up all event handlers.
         *
         * It also displays the Text Loading... until the content is loaded.
         */
        private show(): void {
            InteractiveContent.contentComponent.activateComponent(this);
        }

        private connectConsoleView(consoleView: ConsoleComponent): void {
            this.consoleView = consoleView;
        }

        public render(): JSX.Element {
            return <ConsoleComponent ref={(consoleView) => {
                this.connectConsoleView(consoleView);
            } }>
            </ConsoleComponent>;
        }
    }

    /**
     * The visual representation of the console.
     */
    class ConsoleComponent extends React.Component<{}, {}> {

        render() {
            return <div className="console">
                Console
            </div>
        }
    }
}
