module Otterside {

    export class InteractiveContent extends React.Component<{}, InteractiveContentState> {
        public static contentComponent: InteractiveContent;

        constructor() {
            super();
            this.state = {
                maximized: false
            };
        }

        public minimize() {
            this.setState({
                maximized: false
            });
        }

        public maximize() {
            this.setState({
                maximized: true
            });
        }

        render() {
            //Use refs to get active component
            return <div className={this.state.maximized ? 'maximized interactive-content' : 'interactive-content'}>
                <h2 className="interactive-header">
                    Otterside
                    <div className="flex">
                        <button title="Minimize" onClick={e => this.minimize() }>-</button>
                        <button title="Maximize" onClick={e => this.maximize() }>▢</button>
                    </div>
                </h2>
                <div className="interactive-container">

                </div>
            </div>
        }

        public static setupContent(): void {
            InteractiveContent.contentComponent = ReactDOM.render(<InteractiveContent></InteractiveContent>, document.getElementById('interactive-content')) as InteractiveContent;
        }
    }

    export interface InteractiveContentState {
        maximized: boolean;
    }
}
