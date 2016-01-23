module Otterside {
    export module Http {
        export interface HttpRequest<ResponseType> {
            /**
             * Executes the request and returns a promise that will be resolved on a successfull response and rejected otherwise.
             */
            execute: () => Q.Promise<ResponseType>;
        }

        abstract class HttpRequestBase<ResponseType> implements HttpRequest<ResponseType> {
            private url: string;
            private responseDeferred: Q.Deferred<ResponseType>;
            private request: XMLHttpRequest;

            constructor(url: string) {
                this.url = url;
                this.createRequest();
            }

            execute(): Q.Promise<ResponseType> {
                if (this.responseDeferred) {
                    return this.responseDeferred.promise;
                }

                this.responseDeferred = Q.defer<ResponseType>();

                this.sendRequest(this.request, this.url);

                return this.responseDeferred.promise;
            }

            /**
             * This method should call the open and send methods of the request.
             * Handling of the response is done by the base class.
             *
             * @param  {XMLHttpRequest} request The Request
             * @param  {string}         url     The url to call
             */
            protected abstract sendRequest(request: XMLHttpRequest, url: string): void;

            private checkResponseState(): void {
                if (this.request.readyState === XMLHttpRequest.DONE) {
                    this.parseResponse();
                }
            }

            private parseResponse(): void {
                if (this.request.status === 200) {
                    console.log(this.request.responseText);

                    this.responseDeferred.resolve(JSON.parse(this.request.responseText));
                }
                else {
                    this.responseDeferred.reject(this.buildResponseError());
                }
            }

            private buildResponseError(): string {
                return `Error getting response for **${this.url}**. Status: ${this.request.status} ${this.request.statusText}`;
            }

            private createRequest(): void {
                this.request = new XMLHttpRequest();

                this.request.onreadystatechange = () => this.checkResponseState();
            }
        }

        class HttpGetRequest<ResponseType> extends HttpRequestBase<ResponseType> {
            constructor(url: string) {
                super(url);
            }

            protected sendRequest(request: XMLHttpRequest, url: string): void {
                request.open('GET', url, true);
                request.send();
            }
        }

        /**
         * Creates a GET request to the specified url.
         * The request can be customized and executed later.
         * Don't reuse the request object as the state is tracked interally.
         */
        export function get<ResponseType>(url: string): HttpRequest<ResponseType> {
            return new HttpGetRequest<ResponseType>(url);
        }
    }
}
