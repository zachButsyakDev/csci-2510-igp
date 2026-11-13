// Sandbox for the camera (WASD / arrows) and drag-box selection (click, drag, shift to add).
// Right-click to move selected units to the target location.
class TestScene extends Scene {
    constructor() {
        super("#1d2b1f")

        // Player units (blue) - controllable with right-click
        this.instantiate(new UnitGameObject("player", 2), new Vector2(0, 0))
        this.instantiate(new UnitGameObject("player", 2), new Vector2(80, 0))
        this.instantiate(new UnitGameObject("player", 1.5), new Vector2(-80, 40))

        // Enemy units (red) - selectable but not controllable by player
        this.instantiate(new UnitGameObject("enemy", 2), new Vector2(200, -100))
        this.instantiate(new UnitGameObject("enemy", 2), new Vector2(250, -80))
        this.instantiate(new UnitGameObject("enemy", 2.5), new Vector2(300, -120))

        // Static selectable units (for backward compatibility testing)
        this.instantiate(new StaticUnitGameObject("#ffd166", 1.5), new Vector2(-150, 90))
        this.instantiate(new StaticUnitGameObject("#06d6a0", 3), new Vector2(900, 500))

        
        
        // Resource buildings test
        this.instantiate(new LumberYard(), new Vector2(20, 20))
        this.instantiate(new Farm(), new Vector2(10, 10))
        this.instantiate(new GoldMine(), new Vector2(30, 30))
        
        
        
        // Player (resources + selection + camera) and HUD
        this.instantiate(new PlayerGameObject())
        this.instantiate(new GoldTextObject(), new Vector2(16, 28))
        this.instantiate(new LumberTextObject(), new Vector2(16, 52))
        this.instantiate(new FoodTextObject(), new Vector2(16, 76))
        this.instantiate(new UIGameObject())
        
    }
}
