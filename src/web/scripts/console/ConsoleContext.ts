namespace otterside.console {
    export interface ConsoleContextConfig {
        showInput: boolean;
    }

    export class ConsoleContext {
        public lines: string[];
        public id: number;
        public config: ConsoleContextConfig;

        constructor(id: number, config: ConsoleContextConfig) {
            this.lines = [];
            this.id = id;
            this.config = config;
        }
    }
}
