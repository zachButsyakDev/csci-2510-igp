// A rectangular platform.
// Usage: new PlatformGameObject(halfWidth, halfHeight, color)
class PlatformGameObject extends GameObject {
    /**
     * @param {number} halfW Half-width in pixels
     * @param {number} halfH Half-height in pixels
     * @param {string} color CSS fill color
     */
    constructor(halfW = 60, halfH = 8, color = "#4a7c59") {
        super("Platform", ["Platform"])
        this.addComponent(new PlatformData(), { halfW, halfH, fillStyle: color })
    }
}
