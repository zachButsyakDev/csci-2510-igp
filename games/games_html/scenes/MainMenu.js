class MainScene extends Scene {
    constructor() {
        super()
        this.instantiate(new TextGameObject, new Vector2(700, 300), 0)
        this.instantiate(new LevelControllerGameObject(() => Input.keysDownThisFrame.includes("Enter"), PlatformerScene))
    }
}
