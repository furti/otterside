namespace tutorial.tutorial {
    class TutorialState {
        constructor(public file: string, private command: string, private args?: { [name: string]: string }) {

        }

        public matches(event: otterside.ParsedCommand): boolean {
            if (event.command !== this.command) {
                return false;
            }

            if (!event.arguments) {
                return !this.args;
            }
            else if (!this.args) {
                return false;
            }

            for (var name in Object.keys(event.arguments)) {
                if (event.arguments[name] !== this.args[name]) {
                    return false;
                }
            }

            return true;
        }
    }

    class TutorialStateManager {
        private currentStateIndex: number;
        private states: TutorialState[];

        constructor(private console: otterside.Console) {
            this.console.on.commandExecuted((event: otterside.ParsedCommand) => {
                this.commandExecuted(event);
            });
            this.currentStateIndex = 0;
            this.states = this.setupStates();
        }

        public start(): void {
            this.console.printFile('tutorial-1.md');
        }

        public commandExecuted(event: otterside.ParsedCommand): void {
            let state = this.getCurrentState();

            if (state && state.matches(event)) {
                this.console.printFile(state.file);
                this.currentStateIndex++;
            }
        }

        private getCurrentState(): TutorialState {
            return this.states[this.currentStateIndex];
        }

        private setupStates(): TutorialState[] {
            return [
                new TutorialState('tutorial-2.md', 'help'),
                new TutorialState('tutorial-3.md', 'help', { '': 'read' }),
                new TutorialState('tutorial-4.md', 'list'),
                new TutorialState('tutorial-5.md', 'list', { 'all': 'all' })
            ];
        }
    }

    export function run(commandParams: otterside.CommandParams): void {
        let stateManager = new TutorialStateManager(commandParams.console);
        stateManager.start();
    }
}
