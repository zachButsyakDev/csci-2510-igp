/**
 * Buildable — ghost-preview component for building placement.
 *
 * Attach this to a temporary "ghost" game object created when the player
 * presses 1 / 2 / 3.  RTSInputController creates the ghost and this
 * component keeps it snapped to the mouse in world space.
 *
 * When the player left-clicks, RTSInputController reads `this.buildingType`
 * to know what real building to spawn, then destroys the ghost.
 */
class Buildable extends Component {
    /**
     * @param {"GoldMine"|"LumberYard"|"Farm"} buildingType
     */
    constructor(buildingType) {
        super()
        this.buildingType = buildingType
    }

    update() {
        if (!Input.mousePosition) return
        // Keep the ghost snapped to the mouse in world space
        this.gameObject.transform.position = Globals.screenToWorld(Input.mousePosition)
    }
}
