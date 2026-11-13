class FoodTextObject extends GameObject {
    constructor() {
        // Name must match what UIController looks up: "FoodText"
        super("FoodText", [], "UI")
        this.addComponent(new TextLabel(), { text: "Food: 0", fillStyle: "#ff7f7f", font: "bold 18px monospace" })
    }
}
