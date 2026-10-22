class Collider extends Component {
    get points() {
        return this.gameObject.getComponent(Polygon).points
    }
    
}