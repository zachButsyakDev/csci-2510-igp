class TextGameObject extends GameObject {
    constructor() {
        super("TextGameObject", [], "UI")
        this.addComponent(new TextLabel(), {text:"Welcome to da game, press enter 2 start", font: "20px Times"})

    }
}
