/**
 * Pans the main camera with WASD / arrow keys (and optionally by pushing the mouse to the screen edge).
 * Camera position = the world point shown at the center of the screen.
 */
class CameraController extends Component {
    /** Pan speed in world pixels per second */
    speed = 600

    /** Pan when the mouse is near the edge of the window */
    edgeScrollEnabled = false
    /** Edge scroll trigger distance in pixels */
    edgeSize = 20

    /** Optional limits on where the camera center can go: {minX, maxX, minY, maxY} */
    bounds = null

    lastTime = 0

    start() {
        this.lastTime = performance.now()
    }

    update() {
        // Time.deltaTime is hardcoded to 1/60, which makes the camera speed depend on monitor refresh rate
        // (144Hz would be 2.4x too fast). Measure real elapsed time instead.
        const now = performance.now()
        const dt = Math.min((now - this.lastTime) / 1000, 0.1)
        this.lastTime = now

        let dx = 0
        let dy = 0

        if (Input.keysDown.includes("KeyA") || Input.keysDown.includes("ArrowLeft")) dx -= 1
        if (Input.keysDown.includes("KeyD") || Input.keysDown.includes("ArrowRight")) dx += 1
        if (Input.keysDown.includes("KeyW") || Input.keysDown.includes("ArrowUp")) dy -= 1
        if (Input.keysDown.includes("KeyS") || Input.keysDown.includes("ArrowDown")) dy += 1

        if (this.edgeScrollEnabled && Input.mousePosition) {
            const m = Input.mousePosition
            if (m.x <= this.edgeSize) dx -= 1
            if (m.x >= Engine.canvas.width - this.edgeSize) dx += 1
            if (m.y <= this.edgeSize) dy -= 1
            if (m.y >= Engine.canvas.height - this.edgeSize) dy += 1
        }

        // Normalize so diagonals aren't faster
        const length = Math.sqrt(dx * dx + dy * dy)
        if (length > 0) {
            dx /= length
            dy /= length
        }

        const camPos = Camera.main.transform.position
        camPos.x += dx * this.speed * dt
        camPos.y += dy * this.speed * dt

        if (this.bounds) {
            camPos.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, camPos.x))
            camPos.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, camPos.y))
        }
    }
}
