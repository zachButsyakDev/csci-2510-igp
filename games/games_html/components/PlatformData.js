// PlatformData stores the half-extents used by PlayerController for AABB collision.
// It also draws the platform rectangle itself so no separate Polygon is needed.
class PlatformData extends Component {
    /** @type{number} Half-width of the platform */
    halfW = 60

    /** @type{number} Half-height of the platform */
    halfH = 8

    /** @type{string} Fill color */
    fillStyle = "#4a7c59"

    draw(ctx) {
        ctx.save()
        ctx.translate(this.transform.position.x, this.transform.position.y)
        ctx.fillStyle = this.fillStyle
        ctx.fillRect(-this.halfW, -this.halfH, this.halfW * 2, this.halfH * 2)
        ctx.restore()
    }
}
