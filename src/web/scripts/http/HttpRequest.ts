namespace otterside.http {
  export interface HttpRequest<ResponseType> {
      /**
       * Executes the request and returns a promise that will be resolved on a successfull response and rejected otherwise.
       */
      execute: () => Q.Promise<ResponseType>;
  }
}
