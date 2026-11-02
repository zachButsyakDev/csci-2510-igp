class Collider extends Component {
    /** @type{Vector2[]|undefined} */
    _points

    /** Uses its own points if set, otherwise the Polygon's points */
    get points() {
        return this._points ?? this.gameObject.getComponent(Polygon).points
    }

    set points(points) {
        this._points = points
    }
}
