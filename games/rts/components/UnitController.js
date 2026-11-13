/**
 * Handles unit movement to a target destination.
 * Units move at a constant speed and stop when they reach the target.
 */
class UnitController extends Component {
    speed = 120 // Units per second
    targetPosition = null
    stoppingDistance = 5 // How close to get before stopping

    /**
     * Command the unit to move to a world-space position
     * @param {Vector2} position
     */
    moveTo(position) {
        this.targetPosition = position.clone()
    }

    /**
     * Stop moving immediately
     */
    stop() {
        this.targetPosition = null
    }

    update() {
        if (!this.targetPosition) return

        const direction = this.targetPosition.minus(this.transform.position)
        const distance = direction.magnitude

        // Close enough to stop
        if (distance <= this.stoppingDistance) {
            this.targetPosition = null
            return
        }

        // Move toward target at constant speed
        const movement = direction.normalized().scaled(this.speed * Time.deltaTime)
        
        // Don't overshoot
        if (movement.magnitude > distance) {
            this.transform.position = this.targetPosition.clone()
            this.targetPosition = null
        } else {
            this.transform.position = this.transform.position.plus(movement)
        }
    }
}
