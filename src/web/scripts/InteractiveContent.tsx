module Otterside {

    export class InteractiveContent extends React.Component<{}, InteractiveContentState> {
        public static contentComponent: InteractiveContent;
        private nothingActive: InteractiveComponent;

        constructor() {
            super();
            this.nothingActive = new NothingActiveComponent();

            this.state = {
                maximized: false,
                activeComponent: this.nothingActive
            };
        }

        /**
         * Checks if a component is active now.
         * @return {Boolean} true if a component is active. False if the default "Nothing connected" message is shown.
         */
        public isComponentActive(): boolean {
            return this.state.activeComponent !== this.nothingActive;
        }

        /**
         * Minimize the component.
         */
        public minimize() {
            if (!this.isComponentActive()) {
                return;
            }

            this.setState({
                maximized: false
            });
        }

        /**
         * Maximize the component. If nothing is active maximizing is not possible.
         */
        public maximize() {
            if (!this.isComponentActive()) {
                return;
            }

            this.setState({
                maximized: true
            });
        }

        render() {
            var classes = classNames('interactive-content', {
                'maximized': this.state.maximized,
                'disabled': !this.isComponentActive()
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
                    {this.state.activeComponent.render() }
                </div>
            </div>
        }

        public static setupContent(): void {
            InteractiveContent.contentComponent = ReactDOM.render(<InteractiveContent></InteractiveContent>, document.getElementById('interactive-content')) as InteractiveContent;
        }
    }

    export interface InteractiveComponent {
        render(): JSX.Element;
    }

    export interface InteractiveContentState {
        maximized?: boolean;
        activeComponent?: InteractiveComponent;
    }

    class NothingActiveComponent implements InteractiveComponent {
        render(): JSX.Element {
            return <div>There is no Terminal connected at the moment.</div>;
        }
    }
}
