// The player character — a small square with a PlayerController component.
class PlayerGameObject extends GameObject {
    constructor() {
        super("Player", ["Player"])

        // Draw the player as a small colored square using PlatformData reuse pattern —
        // but we just draw directly with a custom draw component inline via a tiny anon Component subclass.
        const halfW = 12
        const halfH = 12
        this.addComponent(new Polygon(), {
            fillStyle: "#e63946",
            points: [
                new Vector2(-halfW, -halfH),
                new Vector2( halfW, -halfH),
                new Vector2( halfW,  halfH),
                new Vector2(-halfW,  halfH),
            ]
        })

        this.addComponent(new PlayerController())
    }
}
