class Engine {
    /**
     * @type{HTMLCanvasElement} A reference to the canvas HTML element
     */
    static canvas

    /**
     * @type{CanvasRenderingContext2D} A reference to the context we will draw to
     */
    static ctx

    static layers = ["default", "UI"]
    
    static aspectRatio
    
    static cameraWidthInWorldSpace
    
    static letterBoxingWidth = 0
    
    static letterBoxingHeight = 0

    static start(nextScene, settings) {
        Engine.canvas = document.querySelector("#canv")
        Engine.ctx = Engine.canvas.getContext("2d")
        addEventListener("keydown", Input.keydown)
        addEventListener("keyup", Input.keyup)
        addEventListener("mousemove", Input.mousemove)
        addEventListener("mouseup",Input.mouseup)
        addEventListener("mousedown",Input.mousedown)
        addEventListener("contextmenu", e=>e.preventDefault())
        
        SceneManager.nextScene = nextScene

        if(settings) {
            Engine.layers = settings.layers
            Engine.aspectRatio = settings.aspectRatio
            Engine.cameraWidthInWorldSpace = settings.cameraWidthInWorldSpace
        }

        requestAnimationFrame(Engine.gameLoop)
    }

    static gameLoop() {
        SceneManager.update()
        Engine.update()
        Engine.draw()
        Time.update()
        Input.update()
        requestAnimationFrame(Engine.gameLoop)
    }

    static update() {
        SceneManager.currentScene.start()
        SceneManager.currentScene.update()
    }

    static draw() {
        Engine.canvas.width = window.innerWidth
        Engine.canvas.height = window.innerHeight
        SceneManager.currentScene.draw(Engine.ctx)
    }

}