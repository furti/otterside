module Otterside {

    export class InteractiveContent extends React.Component<{}, InteractiveContentState> {
        public static contentComponent: InteractiveContent;

        render() {
            return <div>
                <h2>Otterside</h2>
                <div className="interactive-container"></div>
            </div>
        }

        public static setupContent(): void {
            InteractiveContent.contentComponent = ReactDOM.render(<InteractiveContent></InteractiveContent>, document.getElementById('interactive-content'));
        }
    }

    export interface InteractiveContentState {

    }
}
