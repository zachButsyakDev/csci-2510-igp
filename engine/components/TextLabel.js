class TextLabel extends Component {
    /** @type{string} */
    fillStyle = "black"

    /** @type{string} */
    text = "[BLANK]"

    font = "10px Arial"

    /**
     * Drawn at the game object's origin (the transform is already applied).
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.save()

        ctx.fillStyle = this.fillStyle
        ctx.font = this.font
        ctx.fillText(this.text, 0, 0)

        ctx.restore()
    }
}
