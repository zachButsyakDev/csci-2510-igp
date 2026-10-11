class MainGameObject extends GameObject {
    constructor() {
        super("Main", [], "ships")
        this.addComponent(new UpdateComponent())
        this.addComponent(new Polygon(), {fillStyle:"blue", points:Assets.triangle})
    }
}