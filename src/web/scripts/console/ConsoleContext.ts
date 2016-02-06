namespace otterside.console {
    export class ConsoleContext {
        public lines: string[];
        public id: number;

        constructor(id: number) {
            this.lines = [];
            this.id = id;
        }
    }
}
