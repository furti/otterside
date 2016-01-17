module Otterside {

    export class InteractiveContent extends React.Component<{}, InteractiveContentState> {
        public static contentComponent: InteractiveContent;
        private activeComponent: React.Component<any, any>;

        constructor() {
            super();
            this.state = {
                maximized: false
            };
        }

        public minimize() {
            if (!this.activeComponent) {
                return;
            }

            this.setState({
                maximized: false
            });
        }

        public maximize() {
            if (!this.activeComponent) {
                return;
            }

            this.setState({
                maximized: true
            });
        }

        render() {
            var classes = classNames('interactive-content', {
                'maximized': this.state.maximized,
                'disabled': !this.activeComponent
            });

            //Use refs to get active component
            return <div className={classes}>
                <h2 className="interactive-header">
                    Otterside
                    <div className="flex">
                        <button title="Minimize" onClick={e => this.minimize() }>-</button>
                        <button title="Maximize" onClick={e => this.maximize() }>▢</button>
                    </div>
                </h2>
                <div className="interactive-container">
                    <div className={this.state.actualComponentName ? 'hide' : ''}>There is no terminal connected at the moment.</div>
                </div>
            </div>
        }

        public static setupContent(): void {
            InteractiveContent.contentComponent = ReactDOM.render(<InteractiveContent></InteractiveContent>, document.getElementById('interactive-content')) as InteractiveContent;
        }
    }

    export interface InteractiveContentState {
        maximized?: boolean;
        actualComponentName?: string;
    }
}
