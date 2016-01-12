module Otterside {
    export class ObjectStore {
        private objects: { [type: string]: any };

        constructor() {
            this.objects = {};
        }

        public add(type: string, object: any) {
            this.objects[type] = object;
        }
    }
}
