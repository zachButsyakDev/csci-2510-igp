// Holds the UIController that keeps the HUD text up to date
class UIGameObject extends GameObject {
    constructor() {
        super("UIController", [], "UI")
        this.addComponent(new UIController())
    }
}
