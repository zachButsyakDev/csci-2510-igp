class Polygon extends Component {
    
    /** @type{String} The fill style (background color) of the polygon*/
    fillStyle = "magenta"

    /** @type{Vector2[]} The points in the polygon*/
    points = []

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx The drawing context
     */
    draw(ctx) {
        ctx.save()

        ctx.translate(this.transform.position.x, this.transform.position.y)
        ctx.rotate(this.transform.rotation)
        ctx.scale(this.transform.scale.x, this.transform.scale.y)

        ctx.beginPath()
        for(const point of this.points) {
            ctx.lineTo(point.x, point.y)
        }

        ctx.fillStyle = this.fillStyle
        ctx.fill()

        ctx.restore()
    }
}