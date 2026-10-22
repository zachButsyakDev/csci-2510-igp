class Collisions {
    
    
    
    
    
    
    
    
    
    static isCollisionPolygonPolygon(point, gameObject, gameObjectTwo) {
        //move everything into world space
        let worldSpacePoints = []
        for(let point of gameObject.getComponent(Polygon).points) {
           worldSpacePoints.push(new Vector2(
               gameObject.transform.getWorldMatrix().transformPoint(point).x,
               gameObject.transform.getWorldMatrix().transformPoint(point).y
           ))

        }
        let worldSpacePointsTwo = []
        //find axes for projection
         for(let point of gameObjectTwo.getComponent(Polygon).points) {
           worldSpacePoints.push(new Vector2(
               gameObjectTwo.transform.getWorldMatrix().transformPoint(point).x,
               gameObjectTwo.transform.getWorldMatrix().transformPoint(point).y
           ))
        
        
        
        let axes = []
        for(let i = 0; i < worldSpacePoints.length; i++) {
            let point1 = worldSpacePoints[i]
            let point2 = worldSpacePoints[(i + 1) % worldSpacePoints.length]
            let edge = point2.minus(point1)
            let axis = edge.orthogonal()
            axes.push(axis)

            //check for overlap
            let pointProjection = point.dot(axis)
            let polygonProjections = worldSpacePoints.map(p => p.dot(axis))
            if(pointProjection < Math.min(...polygonProjections) || pointProjection > Math.max(...polygonProjections)) {
                return false
            }
                for(let i = 0; i < worldSpacePoints.length; i++) {
            let point1 = worldSpacePointsTwo[i]
            let point2 = worldSpacePointsTwo[(i + 1) % worldSpacePointsTwo.length]
            let edge = point2.minus(point1)
            let axis = edge.orthogonal()
            axes.push(axis)

            //check for overlap
            
            for(const axis of axes) {
           
                let polygonProjections = worldSpacePoints.map(p => p.dot(axis))
                let polygonProjectionsTwo = worldSpacePointsTwo.map(p => p.dot(axis))
                if(Math.max(...polygonProjectionsTwo) < Math.min(...polygonProjections) || Math.min(...polygonProjectionsTwo) > Math.max(...polygonProjections)) {
                    return false
            }
       
       
        }
        
        


        return true
    }
}