namespace otterside {
    export class MapUtils {
        private static OBJECT_LAYER_NAME = 'objects';

        public static findObjectsByType(map: Phaser.Tilemap, type: string): Array<GameObject<GameObjectProperties>> {
            return MapUtils.findObjects(map, (object) => {
                return object.type === type;
            });
        }

        public static findObjects(map: Phaser.Tilemap, filter: (object: GameObject<GameObjectProperties>) => boolean, breakAfterFirst?: boolean) {
            var array: GameObject<GameObjectProperties>[] = [];

            for (var object of map.objects[MapUtils.OBJECT_LAYER_NAME]) {
                if (filter(object)) {
                    array.push(object);

                    if (breakAfterFirst) {
                        break;
                    }
                }
            }

            return array;
        }

        public static findFirstObjectByType(map: Phaser.Tilemap, type: string): GameObject<GameObjectProperties> {
            var found = MapUtils.findObjects(map, (object) => {
                return object.type === type;
            }, true);

            if (found.length >= 1) {
                return found[0];
            }

            return null;
        }

        /**
         * Create sprites from an objects group in the tiled map.
         *
         * @param {Phaser.Group} group The group to add the sprites to.
         * @param {Phaser.Tilemap} map The map to read the objects from.
         * @param {string} groupName The name of the group on the map to read objects from.
         */
        public static createFromObjects(group: Phaser.Group, map: Phaser.Tilemap, hiddenObjectNames: string[]): void {
            if (!map.objects[MapUtils.OBJECT_LAYER_NAME]) {
                window.console.log('CreateFromObjects: No Objectsgroup with name ' + MapUtils.OBJECT_LAYER_NAME + ' found.');

                return;
            }

            map.objects[MapUtils.OBJECT_LAYER_NAME].forEach((object: GameObject<GameObjectProperties>) => {
                if (object.properties.spriteIndex && hiddenObjectNames.indexOf(object.name) === -1) {
                    object.sprite = group.create(object.x, object.y, 'ottersideTiles', parseInt(object.properties.spriteIndex));

                    if (object.properties.moveable !== 'true') {
                        object.sprite.body.immovable = true;
                    }
                }
            });
        }

        public static findInteractibleObject(map: Phaser.Tilemap, groupName: string, x: number, y: number): GameObject<GameObjectProperties> {
            if (!map.objects[groupName]) {
                window.console.log('findInteractibleObject: No Objectsgroup with name ' + groupName + ' found.');

                return;
            }
            var object: GameObject<GameObjectProperties>,
                closestInteractible: GameObject<GameObjectProperties>,
                closestDistance = Number.MAX_VALUE,
                distance: number;

            for (object of map.objects[groupName]) {
                if (object.properties.interactive === 'true') {
                    distance = Phaser.Math.distance(object.sprite.x, object.sprite.y, x, y);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestInteractible = object;
                    }
                }
            }

            if (closestDistance < 40) {
                return closestInteractible;
            }
        }

        public static activateInteractiveComponent(object: GameObject<GameObjectProperties>, keyboard: Phaser.Keyboard): Q.Promise<void> {
            if (object.type === 'terminal') {
                return new Terminal(object, keyboard).connect();
            }
            else {
                throw `Interactive components of type ${object.type} not supported yet.`
            }
        }
    }
}
