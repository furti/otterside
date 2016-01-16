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
         * Hides the loading screen if it is visible.
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
            return <div className="center vertical">
                <div className="loading-image"></div>
                <h1 className="loading-text">
                    <span>Loading</span>
                    <div className="point1">.</div>
                    <div className="point2">.</div>
                    <div className="point3">.</div>
                </h1>
            </div>
        }
    }

    interface LoadingScreenState {
        visible: boolean;
    }
}
