/// <reference path="./Read.ts"/>
namespace otterside.console.command.read {
    export class MarkdownReader extends console.command.Reader {

        public performRead(): void {
            this.console.printLine(this.getContent());
            this.console.scrollTop();
        }
    }
}
