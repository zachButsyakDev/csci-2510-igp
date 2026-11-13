/**
 * A controllable unit with player/enemy affiliation.
 * Selectable, movable via UnitController, and visually distinct by team.
 */
class UnitGameObject extends GameObject {
    /**
     * @param {string} tag "player" or "enemy" - determines color and team
     * @param {number} size Scale multiplier (default 2 = 40x40 px)
     */
    constructor(tag = "player", size = 2) {
        super("Unit", ["Unit", tag], "units")
        
        this.transform.scale = new Vector2(size, size)
        
        // Color based on team
        const color = tag === "player" ? "#4da6ff" : "#ff6b6b"
        

        this.addComponent(new Polygon(), { fillStyle: color, points: Assets.square })


        this.addComponent(new Collider())

        this.addComponent(new Selectable())
        
        this.addComponent(new UnitController())
    }
}
