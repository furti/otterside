module Otterside {
    export module ObjectStore {
        var sharedObjects: { [type: string]: any } = {};

        export function add(type: string, object: any) {
            this.objects[type] = object;
        }

        export function get(type: string) {
            if (!this.objects[type]) {
                console.log('ObjectStore: cannot find object of type ' + type);
            }

            return this.objects[type];
        }
    }
}
