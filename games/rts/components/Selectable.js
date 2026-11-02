/**
 * Marks a GameObject as selectable by the drag-box / click, and draws the highlight.
 * Uses a simple axis-aligned box around transform.position (independent of the engine's Collider).
 * Hit tests are in world space; draw() is in the object's local space.
 * Add this AFTER the Polygon so the outline draws on top of the fill.
 */
class Selectable extends Component {
    /** Half-width of the selectable area, in world units before transform.scale */
    halfW = 10
    /** Half-height of the selectable area, in world units before transform.scale */
    halfH = 10

    isSelected = false
    isHovered = false

    selectedColor = "#00ff66"
    hoverColor = "rgba(255, 255, 255, 0.6)"

    setSelected(value) {
        this.isSelected = value
    }

    get extents() {
        return {
            hw: this.halfW * Math.abs(this.transform.scale.x),
            hh: this.halfH * Math.abs(this.transform.scale.y),
        }
    }

    /** @param {Vector2} p A world-space point */
    containsPoint(p) {
        const { hw, hh } = this.extents
        const pos = this.transform.position
        return p.x >= pos.x - hw && p.x <= pos.x + hw && p.y >= pos.y - hh && p.y <= pos.y + hh
    }

    /** True if this object's box overlaps the given world-space rectangle */
    overlapsRect(minX, minY, maxX, maxY) {
        const { hw, hh } = this.extents
        const pos = this.transform.position
        return pos.x + hw >= minX && pos.x - hw <= maxX && pos.y + hh >= minY && pos.y - hh <= maxY
    }

    // The game object has already moved/scaled the canvas, so draw around (0, 0).
    // Divide by scale so the outline keeps the same pixel thickness and padding on big or small units.
    draw(ctx) {
        if (!this.isSelected && !this.isHovered) return

        const sx = Math.abs(this.transform.scale.x)
        const sy = Math.abs(this.transform.scale.y)
        const pad = 4

        ctx.save()
        ctx.lineWidth = 2 / Math.min(sx, sy)
        ctx.strokeStyle = this.isSelected ? this.selectedColor : this.hoverColor
        ctx.strokeRect(-this.halfW - pad / sx, -this.halfH - pad / sy, (this.halfW + pad / sx) * 2, (this.halfH + pad / sy) * 2)
        ctx.restore()
    }
}
