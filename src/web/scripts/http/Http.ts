namespace otterside {

    export class Http {
        /**
         * Creates a GET request to the specified url.
         * The request can be customized and executed later.
         * Don't reuse the request object as the state is tracked interally.
         */
        public static get<ResponseType>(url: string): http.HttpRequest<ResponseType> {
            return new http.HttpGetRequest<ResponseType>(url);
        }
    }
}
