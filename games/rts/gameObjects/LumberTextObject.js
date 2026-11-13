class LumberTextObject extends GameObject {
    constructor() {
        // Name must match what UIController looks up: "LumberText"
        super("LumberText", [], "UI")
        this.addComponent(new TextLabel(), { text: "Lumber: 0", fillStyle: "#c68642", font: "bold 18px monospace" })
    }
}
