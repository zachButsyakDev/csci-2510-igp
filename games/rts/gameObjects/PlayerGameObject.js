class PlayerGameObject extends GameObject {
    constructor()
        super("Player", [], "default")
        this.addComponent(new ResourceController())
        this.addComponent(new RTSInputController())
}
