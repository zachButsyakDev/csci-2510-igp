class Component {

    /** @type{GameObject} */
    gameObject

    didStart = false

    /**
     * @returns{Transform} The parent game object's transform
     */
    get transform() {
        return this.gameObject.transform
    }
}