class Scene {
    /** @type{GameObject[]} The game objects in the scene*/
    gameObjects = []

    constructor() {
        let cameraGameObject = new GameObject("MainCamera", ["MainCamera"])
        cameraGameObject.addComponent(new Camera())
        this.instantiate(cameraGameObject)
    }

    /**
     * Create a new game object in this scene
     * @param {GameObject} gameObject The game object to add
     * @param {Vector2} position The position of the game object
     * @param {Number} rotation The rotation of the game object
     */
    instantiate(gameObject, position = new Vector2(0, 0), rotation = 0) {
        this.gameObjects.push(gameObject)
        gameObject.transform.position = position
        gameObject.transform.rotation = rotation
        return gameObject
    }

    /**
     * Start the scene
     */
    start() {
        for (const gameObject of this.gameObjects) {
            gameObject.start()
        }
    }

    /**
     * Update the scene
     */
    update() {
        
        //Collisions
        const collidable = GameObject.findGameObjectsByType(Collider)
        
        if(Input.mousePosition) {
            let matrix = new DOMMatrix()
            matrix.translateSelf(Engine.canvas.width / 2, Engine.canvas.height / 2)
            matrix.multiplySelf(Camera.main.transform.getWorldMatrix.inverse())
            
            let worldPositionDOMPOINT = matrix.inverse().transformPoint(Input.mousePosition)
            let worldPosition = new Vector2(worldPositionDOMPoint.x, worldPositionDOMPoint.y)
            console.log(worldPosition)
            for(const gameObject of collidable) {
                if(Collisions.isCollisionPointPolygon(worldPosition, gameObject)) {
                    gameObject.broadcastMessage("onMouseOver", [])
                }
            }
        }
        
        for(let i = 0; i < collidable.length; i++) {
            for(let j = i + 1; j < collidable.length; j++) {
                if(Collisions.isCollisionPolygonPolygon(collidable[i], collidable[j])) {
                    collidable[i].broadcastMessage("onCollisionStay", [collidable[j]])
                    collidable[j].broadcastMessage("onCollisionStay", [collidable[i]])
                }
                
                
            }
        }
        
        for (const gameObject of this.gameObjects) {
            gameObject.update()
        }

        let temp = []
        for (const gameObject of this.gameObjects) {
            if (!gameObject.markForDestroy)
                temp.push(gameObject)
        }
        this.gameObjects = temp
    }

    /**
     * Draw the scene
     * @param {CanvasRenderingContext2D} ctx The context we are drawing to
     */
    draw(ctx) {
        ctx.fillStyle = Camera.main.backgroundColor
        ctx.fillRect(0, 0, Engine.canvas.width, Engine.canvas.height)

        ctx.save()
        ctx.translate(Engine.canvas.width / 2, Engine.canvas.height / 2)
       //ctx.translate(-Camera.main.transform.position.x, -Camera.main.transform.position.y)
        ctx.setTransform(ctx.getTransform().multiply(Camera.main.transform.getWorldMatrix().inverse()))
        for (const layer of Engine.layers.filter(l=>l!="UI")) {
            for (const gameObject of this.gameObjects.filter(go => go.layer == layer)) {
                gameObject.draw(ctx)
            }
        }
        

        ctx.restore()

        for (const gameObject of this.gameObjects.filter(go => go.layer == "UI")) {
            gameObject.draw(ctx)
        }
    }
}

/**
 * Instantiate a game object in the current scene
 * @param {GameObject} gameObject The game object to create
 * @param {Vector2} position The position of the game object
 * @param {Number} rotation The rotation of the game object
 */
function instantiate(gameObject, position = new Vector2(0, 0), rotation = 0) {
    return SceneManager.currentScene.instantiate(gameObject, position, rotation)
}