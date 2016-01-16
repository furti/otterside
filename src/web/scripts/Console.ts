module Otterside {
    export class Console {
        private contentLoaded: Q.Promise<void>;
        private consoleName: string;

        constructor(consoleName: string) {
            this.consoleName = consoleName;
        }


        public start(): Q.Promise<void> {
            var deferred = Q.defer<void>();

            this.contentLoaded.then(() => {
                deferred.resolve();
            });

            return deferred.promise;
        }

        public load(): Q.Promise<void> {
            var path = '/console/' + this.consoleName;

            var contentLoadDefered = Q.defer<void>();
            this.contentLoaded = contentLoadDefered.promise;

            //TODO: load content from server instead of dummy timeout
            window.setTimeout(() => {
                contentLoadDefered.resolve();
            }, 2000);

            return this.contentLoaded;
        }
    }
}
