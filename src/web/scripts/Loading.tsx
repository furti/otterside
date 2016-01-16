module Otterside {
    /**
     * Shows or hides the Loading Screen.
     */
    export module Loading {
        var loadingContainer = document.getElementById('loading'),
            loadingComponten: React.Component<{}, LoadingScreenState>,
            isShown = false;

        /**
         * Show the loading screen if it is not shown yet.
         */
        export function show(): void {
            if (isShown) {
                return;
            }

            if (!loadingComponten) {
                loadingComponten = ReactDOM.render<{}, LoadingScreenState>(<LoadingScreen></LoadingScreen>, loadingContainer);
            }

            loadingContainer.classList.remove('hide');

            isShown = true;
        }

        /**
         * Hides the console if it is visible.
         */
        export function hide(): void {
            if (!isShown) {
                return;
            }

            loadingContainer.classList.add('hide');
            isShown = false;
        }
    }

    class LoadingScreen extends React.Component<{}, LoadingScreenState> {
        render() {
            return <div>Loading...</div>
        }
    }

    interface LoadingScreenState {
        visible: boolean;
    }
}
