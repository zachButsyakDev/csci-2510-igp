class GoldTextObject extends GameObject {
    constructor() {
        // Name must match what UIController looks up: "GoldText"
        super("GoldText", [], "UI")
        this.addComponent(new TextLabel(), { text: "Gold: 0", fillStyle: "#ffd700", font: "bold 18px monospace" })
    }
}
