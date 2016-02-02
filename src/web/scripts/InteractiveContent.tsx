namespace otterside {

    export class InteractiveContent extends React.Component<{}, InteractiveContentState> {
        public static contentComponent: InteractiveContent;
        private nothingActive: InteractiveComponent;
        private minMaxDeferred: Q.Deferred<void>;

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
         * Sets the component that should be shown.
         * @param {InteractiveComponent} component The component to activate.
         */
        public activateComponent(component: InteractiveComponent): void {
            this.setState({
                activeComponent: component
            });
        }

        /**
         * Sets the default "Nothing active" component as the active one
         */
        public disableActiveComponent(): void {
            if (this.state.maximized) {
                this.minimize().then(() => {
                    this.setState({
                        activeComponent: this.nothingActive
                    });
                });

            }
            else {
                this.setState({
                    activeComponent: this.nothingActive
                });
            }
        }

        /**
         * Minimize the component.
         */
        public minimize(): Q.Promise<void> {
            var deferred = Q.defer<void>();

            if (this.isComponentActive() && this.state.maximized) {
                this.minMaxDeferred = deferred;

                this.setState({
                    maximized: false
                });
            }
            else {
                deferred.resolve();
            }

            return deferred.promise;
        }

        /**
         * Maximize the component. If nothing is active maximizing is not possible.
         */
        public maximize(): Q.Promise<void> {
            var deferred = Q.defer<void>();

            if (this.isComponentActive() && !this.state.maximized) {
                this.minMaxDeferred = deferred;

                this.setState({
                    maximized: true
                });
            }
            else {
                deferred.resolve();
            }

            return deferred.promise;
        }

        private setupRootDiv(root: HTMLDivElement): void {
            if (root) {
                root.addEventListener('transitionend', () => {
                    if (this.minMaxDeferred) {
                        this.minMaxDeferred.resolve();
                        this.minMaxDeferred = undefined;
                    }
                });
            }
        }

        render() {
            var classes = classNames('interactive-content', {
                'maximized': this.state.maximized,
                'disabled': !this.isComponentActive()
            });

            return <div className={classes} ref={(div) => this.setupRootDiv(div) }>
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
