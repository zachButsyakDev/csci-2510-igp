class Input {
    /**
     * @type{string[]} A list of the keys that are currently pressed
     */
    static keysDown = []
    static keysDownThisFrame = []
    static keysUpThisFrame = []

    static mouseButtonsDown = []
    static mouseButtonsDownThisFrame = []
    static mouseButtonsUpThisFrame = []
    static mousePosition
    static mousePositionLastFrame
    static mouseDelta

    /**
     *
     * @param {KeyboardEvent} event Event details for the keydown event
     */
    static keydown(event) {
        if(!Input.keysDown.includes(event.code)) {
            Input.keysDown.push(event.code)
            Input.keysDownThisFrame.push(event.code)

        }
    }


    static mosuemove(event) {
        if(Input.mousePosition) {
            Input.mousePositionLastFrame = Input.mousePosition
        }
        Input.mousePosition = new Vector2(event.clientX, event.clientY)
        if(Input.mousePositionLastFrame) {
            Input.mouseDelta = Input.mousePosition.minus(Input.mousePositionLastFrame)
        }
    }
    /**
     *
     * @param {KeyboardEvent} event Event details for the keyup event
     */
    static keyup(event) {
        let index = Input.keysDown.indexOf(event.code)
        Input.keysDown.splice(index,1)

        Input.keysUpThisFrame.push(event.code)
    }

    static mouseup(event) {
        let index = Input.mouseButtonsDown.indexOf(event.button)
        Input.mouseButtonsDown.splice(index,1)
        Input.mouseButtonsUpThisFrame.push(event.button)
    }
    
    static mousedown(event) {
        if(!Input.mouseButtonsDown.includes(event.button)) {
            Input.mouseButtonsDown.push(event.button)
            Input.mouseButtonsDownThisFrame.push(event.button)

        }
    }
    static update() {
        Input.keysDownThisFrame = []
        Input.keysUpThisFrame = []
        Input.mouseButtonsDownThisFrame = []
        Input.mouseButtonsUpThisFrame = []
    }


}
