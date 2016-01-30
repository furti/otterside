namespace otterside {
    export class MapUtils {
        public static findObjectsByType<ObjectType>(map: Phaser.Tilemap, layer: string, type: string): Array<ObjectType> {
            var array: ObjectType[] = [];

            for (var object of map.objects[layer]) {
                if (object.type === type) {
                    array.push(object);
                }
            }

            return array;
        }

        public static findFirstObjectByType<ObjectType>(map: Phaser.Tilemap, layer: string, type: string, objectType: { new (): ObjectType }): ObjectType {
            for (var object of map.objects[layer]) {
                if (object.type === type) {
                    return object;
                }
            }
        }

        /**
         * Create sprites from an objects group in the tiled map.
         *
         * @param {Phaser.Group} group The group to add the sprites to.
         * @param {Phaser.Tilemap} map The map to read the objects from.
         * @param {string} groupName The name of the group on the map to read objects from.
         */
        public static createFromObjects(group: Phaser.Group, map: Phaser.Tilemap, groupName: string): void {
            if (!map.objects[groupName]) {
                window.console.log('CreateFromObjects: No Objectsgroup with name ' + groupName + ' found.');

                return;
            }

            map.objects[groupName].forEach((object: GameObject<GameObjectProperties>) => {
                if (object.properties.spriteIndex) {
                    object.sprite = group.create(object.x, object.y, 'ottersideTiles', parseInt(object.properties.spriteIndex));

                    if (object.properties.moveable !== 'true') {
                        object.sprite.body.immovable  = true;
                    }
                }
            });
        }
    }
}
