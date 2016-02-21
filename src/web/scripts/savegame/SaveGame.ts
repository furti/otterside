namespace otterside.savegame {
    export interface SaveGame {
        gameObjectState?: { [objectName: string]: GameObjectState };

        riddleState?: { [riddleName: string]: RiddleState };
    }
}
