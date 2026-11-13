class GoldMine extends GameObject {
   constructor(color = "yellow", size = 8) {
       super("GoldMine", ["GoldMine"], "default")
       
       this.addComponent(new Polygon,  { fillStyle: color, points: Assets.square })
       this.transform.scale = new Vector2(size, size)
       this.addComponent(new Collider())
       this.addComponent(new Selectable())
}
    
    
}