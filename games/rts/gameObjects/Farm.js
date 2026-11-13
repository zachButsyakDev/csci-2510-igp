class Farm extends GameObject {
   constructor(color = "green", size = 8) {
       super("Farm", ["Farm"], "default")
       
       this.addComponent(new Polygon,  { fillStyle: color, points: Assets.square })
       this.transform.scale = new Vector2(size, size)
       this.addComponent(new Collider())
       this.addComponent(new Selectable())
}
    
    
}