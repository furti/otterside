module Otterside {
    export module Loading {
        var loadingContainer = document.getElementById('loading'),
            loadingComponten: React.Component<{}, LoadingScreenState>,
            isShown = false;

        export function show() {
            if (isShown) {
                return;
            }

            if (!loadingComponten) {
                loadingComponten = ReactDOM.render<{}, LoadingScreenState>(<LoadingScreen></LoadingScreen>, loadingContainer);
            }

            loadingContainer.classList.remove('hide');

            isShown = true;
        }

        export function hide() {
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
