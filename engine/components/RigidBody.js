class RigidBody extends Component {
    velocity = new Vector2(0, 0)
    gravity = 0
    fixedUpdate() {
        this.velocity.plusEquals(new Vector2(0, this.gravity).scaled(Time.deltaTime))
        this.transform.position.plusEquals(this.velocity.scaled(Time.deltaTime))
    }
}
