namespace otterside.console {
    export class ResizeableTextarea extends React.Component<ResizeableTextareaProps, ResizeableTextareaState> {
        private textarea: HTMLTextAreaElement;

        constructor() {
            super();
        }

        /**
         * Set the focus on the textarea;
         */
        public focus(): void {
            this.textarea.focus();
        }

        private setupTextarea(textarea: HTMLTextAreaElement): void {
            if (!this.textarea) {
                this.textarea = textarea;
            }
        }

        private handleChange(e: React.FormEvent): void {
            this.checkResize(e);
        }

        private checkResize(e: React.FormEvent): void {
            var textarea = e.target as HTMLTextAreaElement;
            textarea.style.minHeight = '0'; //At first reset the min height so that scroll height is computed right
            textarea.style.minHeight = textarea.scrollHeight + 'px';
        }

        render(): JSX.Element {
            return <textarea rows={1} onChange={(e) => this.handleChange(e) } onKeyUp={this.props.onKeyUp} onKeyDown={this.props.onKeyDown}
                ref={(textarea) => this.setupTextarea(textarea) }></textarea>
        }
    }
}
