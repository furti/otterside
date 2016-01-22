module Otterside {

    export class MarkdownParagraph extends React.Component<MarkdownParagraphProps, {}>{


        private renderedContent: string;

        public renderContent(): string {
            if (!this.renderedContent) {
                this.renderedContent = marked(this.props.markdownContent);
            }

            console.log(this.renderedContent);

            return this.renderedContent;
        }

        render(): JSX.Element {
            return <div className={this.props.className} dangerouslySetInnerHTML={{ __html: this.renderContent() }}></div>
        }
    }

    export interface MarkdownParagraphProps extends React.Props<MarkdownParagraph> {
        markdownContent: string;
        className: string;
    }
}
