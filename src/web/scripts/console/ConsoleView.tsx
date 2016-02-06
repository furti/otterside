namespace otterside.console {
    /**
     * The visual representation of the console.
     */
    export class ConsoleView extends React.Component<ConsoleViewProps, ConsoleViewState> {
        private textarea: ResizeableTextarea;
        private root: HTMLDivElement;

        constructor() {
            super();

            this.state = {
                context: null
            };
        }

        /**
         * Set The focus to the command input
         */
        public focusInput(): void {
            if (this.textarea) {
                this.textarea.scrollIntoView();
                this.textarea.focus();
            }
        }

        public setContext(context: console.ConsoleContext): void {
            this.setState({
                context: context
            });
        }

        public scrollTop(): void {
            this.root.scrollTop = 0;
        }

        private handleUp(e: React.KeyboardEvent): void {
            var textarea = e.target as HTMLTextAreaElement;

            if (e.keyCode === 13) {
                //Enter pressed --> execute the command
                this.state.context.lines.push(`$ ${textarea.value}`);
                this.forceUpdate();
                this.focusInput();
                this.state.context.executeCommand(textarea.value);

                textarea.value = '';
            }
        }

        private handleDown(e: React.KeyboardEvent): void {
            //Prevent the default action on enter or tab. We don't want a newline in the textarea nor we want the focus to be lost.
            if (e.keyCode === 13 || e.keyCode === 9) {
                e.preventDefault();
            }
        }

        private connectRoot(root: HTMLDivElement): void {
            if (root) {
                this.root = root;
            }
        }

        render() {
            var lines = this.state.context && this.state.context.lines ? this.state.context.lines : [];

            return <div className="console" onClick={(e) => this.focusInput() } ref={(root) => this.connectRoot(root) }>
                <div className="console-lines">
                    {

                        lines.map((line, index) => {
                            return <MarkdownParagraph key={this.state.context.id + "-line-" + index} markdownContent={line} className="console-line"></MarkdownParagraph>
                        })
                    }
                </div>
                {
                    (() => {
                        if (this.state.context && this.state.context.config.showInput) {
                            return <div className="console-input">
                                <span className="prompt">$</span>
                                <ResizeableTextarea onKeyUp={(event) => this.handleUp(event) } onKeyDown={(event) => this.handleDown(event) } ref={(textarea) => this.textarea = textarea}></ResizeableTextarea>
                            </div>
                        }
                    })()
                }

            </div>
        }
    }
}
