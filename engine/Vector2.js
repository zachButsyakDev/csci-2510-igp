class Vector2 {
    /**
     * @type{Number} The x component of the vector
     */
    x

    /**
     * @type{Number} The y component of the vector
     */
    y

    
    /**
     * 
     * @param {Number} x The x value of the new vector
     * @param {Number} y The y value of the new vector
     */
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    /**
     * Add a Vector2 to this one (this function in read-only)
     * @param {Vector2} other The vector to add to this one
     * @returns A new Vector2 that is the sum of the vectors
     */
    plus(other) {
        return new Vector2(this.x + other.x, this.y + other.y)
    }


    /**
     * Subtract a Vector2 from this one (this function in read-only)
     * @param {Vector2} other The vector to subtract from this one
     * @returns A new Vector2 that is the difference of the vectors
     */
    minus(other) {
        return new Vector2(this.x - other.x, this.y - other.y)
    }

    /**
     * Get the magnitude (length) of the vector
     */
    get magnitude() {
        return Math.sqrt(this.x**2+this.y**2)
    }

    /**
     * Clone this Vector2
     * @returns A new Vector2 with the same x and y values as this one
     */
    clone() {
        return new Vector2(this.x, this.y)
    }
}