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

        public static activateInteractiveComponent(object: GameObject<GameObjectProperties>, keyboard: Phaser.Keyboard): void {
            if (object.type === 'terminal') {
                new Terminal(object, keyboard).connect();
            }
            else {
                throw `Interactive components of type ${object.type} not supported yet.`
            }
        }
    }
}
