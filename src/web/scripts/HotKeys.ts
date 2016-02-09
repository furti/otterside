namespace otterside {

    export const enum Key {
        ESC = 27,
        ENTER = 13,
        TAB = 9,
        UP = 38,
        DOWN = 40,
        LEFT = 37,
        RIGHT = 39
    }

    export declare type HotkeyHandler = (event: KeyboardEvent) => boolean;

    var registeredHandlers: { [key: number]: HotkeyHandler[] } = {};

    export class HotKeys {
        /**
         * Register a handler for a key. When the key is pressed the handler will be called.
         * @param {Key} key The key to listen for
         * @param {KeyboardEvent} handler Function that is called when the key is pressed.
         * @return {boolean} return false if no further handlers should be called.
         */
        public static registerHotkey(key: Key, handler: HotkeyHandler): void {
            if (!registeredHandlers[key]) {
                registeredHandlers[key] = [];
            }

            registeredHandlers[key].push(handler);
        }
    }

    document.addEventListener('keydown', function(event: KeyboardEvent) {
        if (!registeredHandlers[event.keyCode]) {
            return;
        }

        for (let handler of registeredHandlers[event.keyCode]) {
            if (!handler(event)) {
                return;
            }
        }
    });
}
