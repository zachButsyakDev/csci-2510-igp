// A unit that just sits there. Selectable, so it can be used to test the drag-box + highlight.
class StaticUnitGameObject extends GameObject {
    /**
     * @param {string} color CSS fill color
     * @param {number} size Scale multiplier on the 20x20 Assets.square (2 = 40x40 px)
     */
    constructor(color = "#4da6ff", size = 2) {
        super("StaticUnit", ["Unit"], "units")
        this.transform.scale = new Vector2(size, size)
        this.addComponent(new Polygon(), { fillStyle: color, points: Assets.square })
        this.addComponent(new Collider())
        this.addComponent(new Selectable())
    }
}
