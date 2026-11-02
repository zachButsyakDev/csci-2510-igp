class GameObject {
    /**
     * @type{Component[]} The list of components in the game object
     */
    components = []

    /**
     * @type{Boolean} Whether the game object has been marked for destroy
     */
    markForDestroy = false

    /**
     * @type{String} The name of the game object
     */
    name

    tags = []

    layer = "default"

    /** 
     * @returns{Transform} The transform
    */
    get transform() {
        return /** @type {Transform} */ (this.components[0]);
    }

    /**
     * Create a new game object
     * 
     * @param {String} name The name of the game object
     */
    constructor(name, tags = [], layer = 'default') {
        this.addComponent(new Transform())
        this.name = name
        this.tags = tags
        this.layer = layer
    }

    /**
     * 
     * @param {Component} component The component to add
     * @param {Object} parameters An object with the parameters to set on the component
     */
    addComponent(component, parameters) {
        Object.assign(component, parameters)
        this.components.push(component)
        component.gameObject = this
    }

    broadcastMessage(message, args = []) {
        for(const component of this.components) {
            component[message]?.(...args)
        }
    }

    /**
     * Start the game object
     */
    start() {
        for(const component of this.components.filter(c=>!c.didStart)) {
            // @ts-expect-error
            component.start?.()
            component.didStart = true
        }

    }

    /**
     * Update the game object
     */
    update() {
        for(const component of this.components) {
            // @ts-expect-error
            component.update?.()
        }

    }

    /**
     * Draw the game object
     * 
     * @param {CanvasRenderingContext2D} ctx The context to draw to
     */
    draw(ctx) {
        // Move into this object's space once, so components can draw relative to the object's origin
        ctx.save()
        ctx.setTransform(ctx.getTransform().multiply(this.transform.getWorldMatrix()))
        for(const component of this.components) {
            // @ts-expect-error
            component.draw?.(ctx)
        }
        ctx.restore()
    }

    /**
     * Mark the game object for destruction
     */
    destroy() {
        this.markForDestroy = true
    }

    /**
     * Get a component on a game object, based on its type
     * @template {Component} T
     * @param {new (...args: any[]) => T} type The type of the component you are getting
     * @returns {T|undefined} The first component of the given type, undefined otherwise
     */
    getComponent(type) {
        return /** @type {T|undefined} */ (this.components.find(c=>c instanceof type))
    }

    /**
     * Find a game object by name
     * @param {String} name The name of the game object to find
     * @returns The first game object with the give name in the list of game object, undefined otherwise
     */
    static find(name) {
        return SceneManager.currentScene.gameObjects.find(go=>go.name == name )
    }

    static findGameObjectsWithTag(tag) {
        return SceneManager.currentScene.gameObjects.filter(go=>go.tags.includes(tag) )
    }

    static findGameObjectsByType(type) {
        return SceneManager.currentScene.gameObjects.filter(go=>go.components.find(c=>c instanceof type))
    }
}