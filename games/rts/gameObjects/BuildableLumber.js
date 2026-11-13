class BuildableLumber extends GameObject {
    constructor(color = "brown", size = 8) {
        super("LumberYardBuildable", ["LumberYard, Buildable"], "default")

        this.addComponent(new Polygon,  { fillStyle: color, points: Assets.square })
        this.transform.scale = new Vector2(size, size)
        this.addComponent(new Selectable(), { halfW: 10, halfH: 10 })
        //add a "buildable" component
    }


}
