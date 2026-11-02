class Globals {
    /** @type{GameObject[]} The units currently selected by the player */
    static selectedUnits = []

    /**
     * Convert a screen (canvas pixel) position to a world position, using the main camera.
     * Mirrors what Scene.draw does: screen = center + inverse(cameraMatrix) * world
     * @param {Vector2} screenPos
     * @returns {Vector2}
     */
    static screenToWorld(screenPos) {
        const cx = Engine.canvas.width / 2
        const cy = Engine.canvas.height / 2
        const p = Camera.main.transform.getWorldMatrix().transformPoint(new DOMPoint(screenPos.x - cx, screenPos.y - cy))
        return new Vector2(p.x, p.y)
    }

    /**
     * Convert a world position to a screen (canvas pixel) position, using the main camera.
     * @param {Vector2} worldPos
     * @returns {Vector2}
     */
    static worldToScreen(worldPos) {
        const p = Camera.main.transform.getWorldMatrix().inverse().transformPoint(new DOMPoint(worldPos.x, worldPos.y))
        return new Vector2(p.x + Engine.canvas.width / 2, p.y + Engine.canvas.height / 2)
    }
}
