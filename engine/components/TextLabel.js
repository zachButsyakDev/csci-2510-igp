class TextLabel extends Component {
    /** @type{string} The fill color of the text */
    fillStyle = "black"

    /** @type{string} The string to display */
    text  = "[BLANK]"

    font = "10px Arial"

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx The drawing context
     */
    draw(ctx) {
        ctx.save()

        ctx.translate(this.transform.position.x, this.transform.position.y)
        ctx.scale(this.transform.scale.x, this.transform.scale.y)
        ctx.rotate(this.transform.rotation)

        ctx.fillStyle = this.fillStyle

        ctx.font = this.font
        ctx.fillText(this.text, 0, 0)

        ctx.restore()
    }
}