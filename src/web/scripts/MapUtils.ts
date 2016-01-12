/// <reference path="../../../bower_components/phaser/typescript/phaser.d.ts"/>

module Otterside {
    export module MapUtils {
        export function findObjectsByType<ObjectType>(map: Phaser.Tilemap, layer: string,, type: string): Array<ObjectType> {
            var array: ObjectType[] = [];

            for (var object of map.objects[layer]) {
                if (object.type === type) {
                    array.push(object);
                }
            }

            return array;
        }

        export function findFirstObjectByType<ObjectType>(map: Phaser.Tilemap, layer: string, type: string, objectType: { new (): ObjectType }): ObjectType {
            for (var object of map.objects[layer]) {
                if (object.type === type) {
                    return object;
                }
            }
        }
    }
}
