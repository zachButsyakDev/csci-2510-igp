class Vector2 {
    /** @type{Number} */
    x

    /** @type{Number} */
    y

    /**
     * @param {Number} x
     * @param {Number} y
     */
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    /**
     * @param {Vector2} other
     * @returns A new Vector2: this + other
     */
    plus(other) {
        return new Vector2(this.x + other.x, this.y + other.y)
    }

    /**
     * @param {Vector2} other
     * @returns A new Vector2: this - other
     */
    minus(other) {
        return new Vector2(this.x - other.x, this.y - other.y)
    }

    /** The length of the vector */
    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    /** @returns A new Vector2 with the same values */
    clone() {
        return new Vector2(this.x, this.y)
    }

    /**
     * @param {Vector2} other
     * @returns {Number} The dot product
     */
    dot(other) {
        return this.x * other.x + this.y * other.y
    }

    /** @returns A new Vector2 at a right angle to this one */
    orthogonal() {
        return new Vector2(this.y, -this.x)
    }

    normalized() {
        return new Vector2(this.x / this.magnitude, this.y / this.magnitude)
    }

    scaled(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar)
    }
    
    plusEquals(other) {
       //return new Vector2(this.x + other.x, this.y + other.y)
       this.x += other.x
       this.y += other.y
    }





}
