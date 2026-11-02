// Sandbox for the camera (WASD / arrows) and drag-box selection (click, drag, shift to add).
class TestScene extends Scene {
    constructor() {
        super("#1d2b1f")

        // Static selectable units. The last one is far away: pan the camera to find it.
        this.instantiate(new StaticUnitGameObject("#4da6ff", 2), new Vector2(0, 0))
        this.instantiate(new StaticUnitGameObject("#ff6b6b", 2), new Vector2(120, -60))
        this.instantiate(new StaticUnitGameObject("#ffd166", 1.5), new Vector2(-150, 90))
        this.instantiate(new StaticUnitGameObject("#06d6a0", 3), new Vector2(900, 500))

        // Player (resources + selection + camera) and HUD
        this.instantiate(new PlayerGameObject())
        this.instantiate(new GoldTextObject(), new Vector2(16, 28))
        this.instantiate(new LumberTextObject(), new Vector2(16, 52))
        this.instantiate(new FoodTextObject(), new Vector2(16, 76))
        this.instantiate(new UIGameObject())
    }
}
