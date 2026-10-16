class Transform extends Component {
    /** @type{Vector2} The position of the transform*/
    position = new Vector2(0,0)

    /** @type{Vector2} The scale of the transform */
    scale = new Vector2(1,1)

    /** @type{Number} The rotation of the transform in radians */
    rotation = 0

    parent

    setParent(parentTransform) {
        this.parent = parentTransform
    }

    getLocalMatrix() {
        let matrix = new DOMMatrix()
        matrix.translateSelf(this.position.x, this.position.y)
        matrix.scaleSelf(this.scale.x, this.scale.y)
        matrix.rotateSelf(this.rotation * 180 / Math.PI)
        return matrix
    }

    getWorldMatrix() {
        if(!this.parent) 
            return this.getLocalMatrix()
        return this.parent.getWorldMatrix().multiply(this.getLocalMatrix())
    }
}