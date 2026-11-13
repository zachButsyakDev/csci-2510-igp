class PlayerController extends Component {
    speed = 160
    jumpForce = -400
    gravity = 800

    // vertical velocity — positive = falling down (canvas Y is downward)
    velY = 0

    // half-extents of the player rect for collision
    halfW = 12
    halfH = 12

    // grounded flag set each frame by collision check
    isGrounded = false

    update() {
        const dt = Time.deltaTime

        // --- horizontal movement ---
        if (Input.keysDown.includes("ArrowLeft") || Input.keysDown.includes("KeyA")) {
            this.transform.position.x -= this.speed * dt
        }
        if (Input.keysDown.includes("ArrowRight") || Input.keysDown.includes("KeyD")) {
            this.transform.position.x += this.speed * dt
        }

        // --- gravity ---
        this.velY += this.gravity * dt

        // --- jump (only when grounded) ---
        if (this.isGrounded && (Input.keysDown.includes("Space") || Input.keysDown.includes("ArrowUp") || Input.keysDown.includes("KeyW"))) {
            this.velY = this.jumpForce
            this.isGrounded = false
        }

        // --- apply vertical velocity ---
        this.transform.position.y += this.velY * dt

        // --- platform collision (jank AABB, resolves from above only) ---
        this.isGrounded = false
        const platforms = GameObject.findGameObjectsWithTag("Platform")
        const px = this.transform.position.x
        const py = this.transform.position.y

        for (const platform of platforms) {
            const plat = platform.getComponent(PlatformData)
            if (!plat) continue

            const platX = platform.transform.position.x
            const platY = platform.transform.position.y

            // AABB overlap check
            const overlapX = (px + this.halfW) > (platX - plat.halfW) && (px - this.halfW) < (platX + plat.halfW)
            const overlapY = (py + this.halfH) > (platY - plat.halfH) && (py - this.halfH) < (platY + plat.halfH)

            if (overlapX && overlapY) {
                const prevBottom = (py - this.velY * dt) + this.halfH
                const platTop = platY - plat.halfH

                // only resolve if player was above the platform top last frame
                if (prevBottom <= platTop + 4) {
                    this.transform.position.y = platTop - this.halfH
                    this.velY = 0
                    this.isGrounded = true
                }
            }
        }

        // --- camera follows player horizontally, fixed vertical ---
        Camera.main.transform.position.x = this.transform.position.x
        Camera.main.transform.position.y = this.transform.position.y - 50
    }
}
