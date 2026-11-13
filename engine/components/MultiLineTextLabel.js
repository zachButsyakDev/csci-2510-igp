class MultiLineTextLabel extends Component {
    /** @type{string} */
    fillStyle = "black"

    /** @type{string} */
    text = "[BLANK]"

    font = "10px Arial"

    /** Lines wrap once they get wider than this many pixels */
    maxWidth = 200

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.save()

        ctx.fillStyle = this.fillStyle
        ctx.font = this.font

        const metrics = ctx.measureText("")
        const lineHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

        let y = 0
        let line = ""
        for (const word of this.text.split(" ")) {
            const candidate = line + word + " "
            if (line !== "" && ctx.measureText(candidate).width > this.maxWidth) {
                ctx.fillText(line, 0, y)
                y += lineHeight
                line = word + " "
            } else {
                line = candidate
            }
        }
        ctx.fillText(line, 0, y)

        ctx.restore()
    }
}
