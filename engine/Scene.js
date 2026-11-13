class Scene {
    /** @type{GameObject[]} The game objects in the scene*/
    gameObjects = []

    /**
     * @param {String} backgroundColor Optional background color for the camera
     */
    constructor(backgroundColor) {
        let cameraGameObject = new GameObject("MainCamera", ["MainCamera"])
        cameraGameObject.addComponent(new Camera())
        this.instantiate(cameraGameObject)
        if(backgroundColor) {
            cameraGameObject.getComponent(Camera).backgroundColor = backgroundColor
        }
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
        for (const gameObject of this.gameObjects) {
            gameObject.broadcastMessage("fixedUpdate")
        }

        //Collisions
        const collidable = GameObject.findGameObjectsByType(Collider)

        if(Input.mousePosition && collidable.length > 0) {
            // screen -> world: undo the "center of screen + inverse camera" transform used in draw()
            const cameraMatrix = Camera.main.transform.getWorldMatrix()
            const worldPoint = cameraMatrix.transformPoint(new DOMPoint(
                Input.mousePosition.x - Engine.canvas.width / 2,
                Input.mousePosition.y - Engine.canvas.height / 2
            ))
            const worldPosition = new Vector2(worldPoint.x, worldPoint.y)

            for(const gameObject of collidable) {
                if(Collisions.isCollisionPointPolygon(collidable.layer == "UI" ? Input.mousePosition : worldPosition, gameObject)) {
                    gameObject.broadcastMessage("onMouseOver", [])
                }
            }
        }

        //handle polygon collision
        const physicalCollisions = []
        for(let i = 0; i < collidable.length; i++) {
            for(let j = i + 1; j < collidable.length; j++) {
                const one = collidable[i]
                const two = collidable[j]
                // Two static objects never need to be checked
                if(!one.getComponent(RigidBody) && !two.getComponent(RigidBody))
                    continue

                const minimumTransformVector = Collisions.isCollisionPolygonPolygon(one, two)
                if(minimumTransformVector) {
                    if(!one.getComponent(Collider).isTrigger && !two.getComponent(Collider).isTrigger) {
                        one.broadcastMessage("onCollisionStay", [two, minimumTransformVector])
                        two.broadcastMessage("onCollisionStay", [one, minimumTransformVector.scaled(-1)])
                        physicalCollisions.push({one, two, minimumTransformVector})
                    }
                    else {
                        one.broadcastMessage("onTriggerStay", [two, minimumTransformVector])
                        two.broadcastMessage("onTriggerStay", [one, minimumTransformVector.scaled(-1)])
                    }
                }
            }
        }

        //handle physics
        for(const physicalCollision of physicalCollisions) {
            if(physicalCollision.one.getComponent(RigidBody)) {
                physicalCollision.one.transform.position.plusEquals(physicalCollision.minimumTransformVector)
            }
            if(physicalCollision.two.getComponent(RigidBody)) {
                physicalCollision.two.transform.position.plusEquals(physicalCollision.minimumTransformVector.scaled(-1))
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
        Engine.letterBoxingHeight = 0
        if(Engine.aspectRatio) {
            const currentAspectRatio = Engine.canvas.width / Engine.canvas.height
            if(Engine.aspectRatio > currentAspectRatio) {
                const maxHeight = Engine.canvas.width / Engine.aspectRatio
                Engine.letterBoxingHeight = Engine.canvas.height - maxHeight
            }
           else {
               const maxWidth = Engine.aspectRatio * Engine.canvas.height
               Engine.letterBoxingWidth = Engine.canvas.width - maxWidth
           }
       
       
        }
        
        
        
        
        ctx.save()
        ctx.translate(Engine.canvas.width / 2, Engine.canvas.height / 2)
        if(Engine.cameraWidthInWorldSpace) {
            const scalar = Engine.cameraWidthInWorldSpace / (Engine.canvas.width - Engine.letterBoxingWidth)
            ctx.scale(1 / scalar, 1 / scalar)
        }
       //ctx.translate(-Camera.main.transform.position.x, -Camera.main.transform.position.y)
        ctx.setTransform(ctx.getTransform().multiply(Camera.main.transform.getWorldMatrix().inverse()))
        for (const layer of Engine.layers.filter(l=>l!="UI")) {
            for (const gameObject of this.gameObjects.filter(go => go.layer == layer)) {
                gameObject.draw(ctx)
            }
        }
        

        ctx.restore()

        //draw letter boxing
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, Engine.canvas.width, Engine.letterBoxingHeight / 2)
        ctx.fillRect(0, Engine.canvas.height - Engine.letterBoxingHeight / 2, Engine.canvas.width, Engine.letterBoxingHeight / 2)
        ctx.fillRect(0, 0, Engine.letterBoxingWidth / 2, Engine.canvas.height)
        ctx.fillRect(Engine.canvas.width - Engine.letterBoxingWidth / 2, 0, Engine.letterBoxingWidth / 2, Engine.canvas.height)
        
        
        
        
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