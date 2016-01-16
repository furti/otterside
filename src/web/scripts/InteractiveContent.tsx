module Otterside {

    export class InteractiveContent extends React.Component<{}, InteractiveContentState> {
        public static contentComponent: InteractiveContent;

        render() {
            return <div>
                <h2 className="interactive-header">
                    Otterside
                    <div className="flex">
                        <button title="Minimize">-</button>
                        <button title="Maximize">▢</button>
                    </div>
                </h2>
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
