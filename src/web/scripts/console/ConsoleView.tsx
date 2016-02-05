namespace otterside.console {
    /**
     * The visual representation of the console.
     */
    export class ConsoleView extends React.Component<ConsoleViewProps, ConsoleViewState> {

        private textarea: ResizeableTextarea;

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

            this.textarea.scrollIntoView();
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
                    <ResizeableTextarea onKeyUp={(event) => this.handleUp(event) } onKeyDown={(event) => this.handleDown(event) } ref={(textarea) => this.textarea = textarea}>
                    </ResizeableTextarea>
                </div>
            </div>
        }
    }
}
