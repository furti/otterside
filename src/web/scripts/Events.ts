namespace otterside {
    export type EventHandler = () => void;

    export class Events {
        private eventHandlers: { [event: number]: EventHandler[] } = {};

        /**
         * Fires all registered Event handlers in the chain.
         * @param {number} event the event to fire.
         */
        public fire(event: number): void {
            if (!this.eventHandlers[event]) {
                return;
            }

            this.eventHandlers[event].forEach((event) => {
                event();
            });
        }

        /**
         * Register a event handler for the given event.
         * Multiple event handlers can be registered for a single event. They will be called in the order they where registered.
         * @param {number}       event   the event
         * @param {EventHandler} handler the handler function
         */
        public on(event: number, handler: EventHandler): void {
            if (!this.eventHandlers[event]) {
                this.eventHandlers[event] = [];
            }

            this.eventHandlers[event].push(handler);
        }
    }
}
