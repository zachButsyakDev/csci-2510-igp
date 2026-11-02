// Invisible "brain" of the player: resources, mouse selection, camera control.
// On the "UI" layer so RTSInputController can draw the drag-box in screen space.
class PlayerGameObject extends GameObject {
    constructor() {
        super("Player", ["Player"], "UI")
        this.addComponent(new ResourceController())
        this.addComponent(new RTSInputController())
        this.addComponent(new CameraController())
    }
}
