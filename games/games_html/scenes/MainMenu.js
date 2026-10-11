class MainScene extends Scene {
    constructor() {
        super()
        this.instantiate(new TextGameObject, new Vector2(250, 150))
        this.instantiate(new LevelControllerGameObject(() => Input.keysDown.includes("Enter"), PlatformerScene))
    }
}
