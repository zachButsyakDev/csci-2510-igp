class LevelControllerGameObject extends GameObject {
    constructor(condition, nextScene) {
        super("LevelControllerGameObject")
        this.addComponent(new LevelController(condition, nextScene))
    }
}
