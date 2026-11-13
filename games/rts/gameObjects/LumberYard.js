class LumberYard extends GameObject {
   constructor(color = "brown", size = 8) {
       super("LumberYard", ["LumberYard"], "default")
       
       this.addComponent(new Polygon,  { fillStyle: color, points: Assets.square })
       this.transform.scale = new Vector2(size, size)
       this.addComponent(new Collider())
       this.addComponent(new Selectable())
}
    
    
}