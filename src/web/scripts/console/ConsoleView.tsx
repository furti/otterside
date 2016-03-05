namespace otterside.console {
    /**
     * The visual representation of the console.
     */
    export class ConsoleView extends React.Component<ConsoleViewProps, ConsoleViewState> {
        private scrollTimeout: number;
        private textarea: ResizeableTextarea;
        private autocomplete: AutocompleteView;
        private linesContainer: HTMLDivElement;

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
                this.textarea.focus();
            }
        }

        public setContext(context: console.ConsoleContext): void {
            this.setState({
                context: context
            });
        }

        public scrollTop(): void {
            if (this.scrollTimeout) {
                window.clearTimeout(this.scrollTimeout);
            }

            this.scrollTimeout = window.setTimeout(() => this.linesContainer.scrollTop = 0, 1);
        }

        public scrollBottom(): void {
            if (this.scrollTimeout) {
                window.clearTimeout(this.scrollTimeout);
            }

            this.scrollTimeout = window.setTimeout(() => this.linesContainer.scrollTop = this.linesContainer.scrollHeight, 1);
        }

        private handleUp(e: React.KeyboardEvent): void {
            var textarea = e.target as HTMLTextAreaElement;

            if (e.keyCode === Key.ENTER) {
                if (this.autocomplete.isVisible()) {
                    /*
                     * When the autocomplete is shown we have to take the currently selected value.
                     * No need to execute the command.
                     */
                    textarea.value = this.autocomplete.getCurrentValue();
                    this.autocomplete.hide();
                }
                else if (textarea.value.trim().length > 0) {
                    //Enter pressed and we have some text --> execute the command
                    this.printActualValue(textarea.value);
                    this.state.context.executeCommand(textarea.value);
                    textarea.value = '';
                }
            }
            else if (e.keyCode === Key.C && e.ctrlKey) {
                this.printActualValue(textarea.value);
                textarea.value = '';
            }
            else if (e.keyCode === Key.TAB) {
                this.autocomplete.show(this.state.context.autocomplete(textarea.value));
            }
            else if (e.keyCode === Key.ESC) {
                if (this.autocomplete.isVisible()) {
                    this.autocomplete.hide();
                }
            }
            else if (e.keyCode === Key.UP) {
                if (this.autocomplete.isVisible()) {
                    this.autocomplete.selectNext();
                }
            }
            else if (e.keyCode === Key.DOWN) {
                if (this.autocomplete.isVisible()) {
                    this.autocomplete.selectPrevious();
                }
            }
        }

        private printActualValue(actualValue: string) {
            this.state.context.lines.push(`$ ${actualValue}`);
            this.forceUpdate();
            this.focusInput();
        }

        private handleDown(e: React.KeyboardEvent): void {
            //Prevent the default action for some key combinations
            if (e.keyCode === Key.ENTER || e.keyCode === Key.TAB || e.ctrlKey || e.keyCode === Key.ESC ||
                e.keyCode === Key.UP || e.keyCode === Key.DOWN) {
                e.preventDefault();
            }
        }

        private connectLinesContainer(linesContainer: HTMLDivElement): void {
            if (linesContainer) {
                this.linesContainer = linesContainer;
            }
        }

        render() {
            var lines = this.state.context && this.state.context.lines ? this.state.context.lines : [];

            return <div className="console" onClick={(e) => this.focusInput() } >
                <div className="console-lines" ref={(linesContainer) => this.connectLinesContainer(linesContainer) }>
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
                                <AutocompleteView ref={(autocomplete) => this.autocomplete = autocomplete}></AutocompleteView>
                                <div className="input-container">
                                    <span className="prompt">$</span>
                                    <ResizeableTextarea onKeyUp={(event) => this.handleUp(event) } onKeyDown={(event) => this.handleDown(event) } ref={(textarea) => this.textarea = textarea}></ResizeableTextarea>
                                </div>
                            </div>
                        }
                    })()
                }

            </div>
        }
    }
}
