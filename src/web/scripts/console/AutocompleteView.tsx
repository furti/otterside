namespace otterside.console {
    export class AutocompleteView extends React.Component<AutocompleteViewProps, AutocompleteViewState> {

        constructor() {
            super();

            this.state = {
                visible: false,
                possibleCommands: []
            };
        }

        /**
         * Displays the autocomplete with all the possible commands
         * @param possibleCommands: string[] List of possible commands
         */
        public show(possibleCommands: string[]): void {
            if (possibleCommands && possibleCommands.length > 0) {
                this.setState({
                    visible: true,
                    possibleCommands: possibleCommands
                });
            }
            else {
                this.setState({
                    visible: false,
                    possibleCommands: []
                });
            }
        }

        render() {
            var classes = classNames('autocomplete', {
                'hide': !this.state.visible
            });

            return <div className={classes}>
                {
                    this.state.possibleCommands.map((line, index) => {
                        return <div key={"autocomplete-entry-" + index} className="autocomplete-entry">{line}</div>
                    })
                }
            </div>
        }
    }

    export interface AutocompleteViewProps extends React.Props<AutocompleteView> {

    }

    export interface AutocompleteViewState {
        visible: boolean;
        possibleCommands: string[];
    }
}
