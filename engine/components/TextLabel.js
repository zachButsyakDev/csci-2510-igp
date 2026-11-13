class TextLabel extends Component {
    /** @type{string} */
    fillStyle = "black"

    /** @type{string} */
    text = "[BLANK]"

    font = "10px Arial"

    /** Horizontal alignment: "left", "center" or "right" */
    textAlign = "left"

    /** Vertical alignment */
    textBaseline = "alphabetic"

    /**
     * Drawn at the game object's origin (the transform is already applied).
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.save()

        ctx.fillStyle = this.fillStyle
        ctx.font = this.font
        ctx.textAlign = this.textAlign
        ctx.textBaseline = this.textBaseline
        ctx.fillText(this.text, 0, 0)

        ctx.restore()
    }
}
