class TextGameObject extends GameObject {
    constructor() {
        super("TextGameObject", [], "UI")
        this.addComponent(new TextLabel(), {text:"end text ;o", font: "20px Times"})

    }
}
