/**
 * Marks a GameObject as selectable by the drag-box / click, and draws the highlight.
 * Delegates all hit-testing to the engine's Collider and Collisions system.
 *
 * The game object must have a Collider (auto-added in start() if missing).
 * Add this component AFTER Polygon so the outline draws on top of the fill.
 */
class Selectable extends Component {
    isSelected = false
    isHovered = false

    selectedColor = "#00ff66"
    hoverColor = "rgba(255, 255, 255, 0.6)"

    start() {
        // Ensure a Collider is present so Collisions methods work.
        // If the caller already added one, this is a no-op.
        if (!this.gameObject.getComponent(Collider)) {
            this.gameObject.addComponent(new Collider())
        }
    }

    setSelected(value) {
        this.isSelected = value
    }

    /** @param {Vector2} p A world-space point */
    containsPoint(p) {
        return Collisions.isCollisionPointPolygon(p, this.gameObject)
    }

    /**
     * True if this object's collider overlaps the given world-space axis-aligned rectangle.
     * Uses SAT via the engine's Collisions helpers so it works correctly for
     * rotated and scaled shapes.
     * @param {number} minX
     * @param {number} minY
     * @param {number} maxX
     * @param {number} maxY
     */
    overlapsRect(minX, minY, maxX, maxY) {
        const rectPoints = [
            new Vector2(minX, minY),
            new Vector2(maxX, minY),
            new Vector2(maxX, maxY),
            new Vector2(minX, maxY),
        ]

        const objPoints = Collisions.getWorldPoints(this.gameObject)

        const axes = [
            ...Collisions.getAxes(rectPoints, true),
            ...Collisions.getAxes(objPoints, true),
        ]

        for (const axis of axes) {
            const rectProj = rectPoints.map(p => p.dot(axis))
            const objProj  = objPoints.map(p => p.dot(axis))
            if (
                Math.max(...rectProj) < Math.min(...objProj) ||
                Math.max(...objProj)  < Math.min(...rectProj)
            ) {
                return false
            }
        }
        return true
    }

    /**
     * Draw the selection/hover outline.
     * The canvas is already transformed into this object's local space,
     * so the Collider's local points are drawn directly.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.isSelected && !this.isHovered) return

        const collider = this.gameObject.getComponent(Collider)
        if (!collider) return

        const pts = collider.points
        if (!pts || pts.length === 0) return

        const sx = Math.abs(this.transform.scale.x)
        const sy = Math.abs(this.transform.scale.y)

        ctx.save()
        ctx.lineWidth = 2 / Math.min(sx, sy)
        ctx.strokeStyle = this.isSelected ? this.selectedColor : this.hoverColor

        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }
}
