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

    update() {
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
        camPos.x += dx * this.speed * Time.deltaTime
        camPos.y += dy * this.speed * Time.deltaTime

        if (this.bounds) {
            camPos.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, camPos.x))
            camPos.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, camPos.y))
        }
    }
}
