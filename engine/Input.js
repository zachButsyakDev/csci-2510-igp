class Input {
    /**
     * @type{string[]} A list of the keys that are currently pressed
     */
    static keysDown = []

    /**
     * 
     * @param {KeyboardEvent} event Event details for the keydown event
     */
    static keydown(event) {
        if(!Input.keysDown.includes(event.code))
            Input.keysDown.push(event.code)
    }

    /**
     * 
     * @param {KeyboardEvent} event Event details for the keyup event
     */
    static keyup(event) {
        let index = Input.keysDown.indexOf(event.code)
        Input.keysDown.splice(index,1)

    }
}