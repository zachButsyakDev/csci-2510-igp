// Both checks use the Separating Axis Theorem, so shapes must be convex.
class Collisions {

    /**
     * @param {GameObject} gameObject A game object with a Collider
     * @returns {Vector2[]} The collider's points in world space
     */
    static getWorldPoints(gameObject) {
        const matrix = gameObject.transform.getWorldMatrix()
        return gameObject.getComponent(Collider).points.map(point => {
            const p = matrix.transformPoint(new DOMPoint(point.x, point.y))
            return new Vector2(p.x, p.y)
        })
    }

    /**
     * One axis per edge: the axis perpendicular to that edge
     * @param {Vector2[]} points
     * @returns {Vector2[]}
     */
    static getAxes(points) {
        return points.map((point, i) => points[(i + 1) % points.length].minus(point).orthogonal())
    }

    /**
     * @param {Vector2} point A point in world space
     * @param {GameObject} gameObject A game object with a Collider
     * @returns {boolean} True if the point is inside the collider
     */
    static isCollisionPointPolygon(point, gameObject) {
        const worldPoints = Collisions.getWorldPoints(gameObject)

        for (const axis of Collisions.getAxes(worldPoints)) {
            const pointProjection = point.dot(axis)
            const projections = worldPoints.map(p => p.dot(axis))
            if (pointProjection < Math.min(...projections) || pointProjection > Math.max(...projections))
                return false
        }
        return true
    }

    /**
     * @param {GameObject} gameObject A game object with a Collider
     * @param {GameObject} gameObjectTwo A game object with a Collider
     * @returns {boolean} True if the two colliders overlap
     */
    static isCollisionPolygonPolygon(gameObject, gameObjectTwo) {
        const pointsOne = Collisions.getWorldPoints(gameObject)
        const pointsTwo = Collisions.getWorldPoints(gameObjectTwo)

        const axes = Collisions.getAxes(pointsOne).concat(Collisions.getAxes(pointsTwo))
        
        let minimumTransformVector = new Vector2(Number.MAX_VALUE, Number.MAX_VALUE))
        
        
        
        
        
        for (const axis of axes) {
            const projectionsOne = pointsOne.map(p => p.dot(axis))
            const projectionsTwo = pointsTwo.map(p => p.dot(axis))
            // A gap on any axis means they don't touch
            if (Math.max(...projectionsTwo) < Math.min(...projectionsOne) || Math.min(...projectionsTwo) > Math.max(...projectionsOne))
                return false
            
            const minOverlap = Math.min(Math.max(...projectionsTwo) - Math.min(...projectionsOne,  Math.min(...projectionsTwo)) - Math.max(...projectionsOne))
            if(minOverlap < minimumTransformVector.magnitude) {
                minimumTransformVector = axis.normalized().scaled(minOverlap)
            }
        }
        if(gameObject.transform.position.minus(gameObjectTwo.transform.position).dot(minimumTransformVector) > 0) {
            return minimumTransformVector
        }
        return minimumTransformVector.scaled(-1)
    }
}
