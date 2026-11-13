class PlatformerScene extends Scene {
    // start() is called after SceneManager.currentScene is set, so Camera.main is safe here
    start() {
        super.start()
        Camera.main.backgroundColor = "#87ceeb"
    }

    constructor() {
        super()


        this.instantiate(new PlatformGameObject(500, 16, "#5c4033"), new Vector2(0, 200))
        /*
        make this into an actual conditional, could be an if statement instead of having to do that lambda function deal or whatever.
        this.instantiate(new LevelControllerGameObject(() => Input.mouseButtonsDown.includes("mouseButton1"), EndScene))
        */

        this.instantiate(new PlatformGameObject(50, 8, "#4a7c59"),  new Vector2(-160, 120))
        this.instantiate(new PlatformGameObject(40, 8, "#4a7c59"),  new Vector2( -60, 60))
        this.instantiate(new PlatformGameObject(45, 8, "#4a7c59"),  new Vector2(  60, 20))


        this.instantiate(new PlatformGameObject(35, 8, "#3d6b47"),  new Vector2( 180, -20))
        this.instantiate(new PlatformGameObject(35, 8, "#3d6b47"),  new Vector2( 300, -70))
        this.instantiate(new PlatformGameObject(35, 8, "#3d6b47"),  new Vector2( 420, -130))


        this.instantiate(new PlatformGameObject(60, 8, "#2c5f2e"),  new Vector2( 550, -180))
        this.instantiate(new PlatformGameObject(55, 8, "#2c5f2e"),  new Vector2( 670, -240))
        this.instantiate(new PlatformGameObject(70, 8, "#2c5f2e"),  new Vector2( 820, -200))


        this.instantiate(new PlatformGameObject(300, 16, "#5c4033"), new Vector2(800, 200))


        this.instantiate(new PlatformGameObject(80, 8, "#7b3f00"),  new Vector2(1000, -280))


        this.instantiate(new PlayerGameObject(), new Vector2(-300, 160))

        const hud = new GameObject("HUD", [], "UI")
        hud.addComponent(new TextLabel(), {
            text: "← → / A D  move      Space / ↑ / W  jump",
            fillStyle: "#222222",
            font: "bold 14px monospace"
        })
        this.instantiate(hud, new Vector2(12, 22))
    }
}
