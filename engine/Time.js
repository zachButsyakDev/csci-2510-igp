class Time {
    /**
     * @type{Number} The time in seconds since the last frame
     */
    static deltaTime = 1/60

    /**
     * @type{Number} The elapsed time in the game
     */
    static time = 0

    /**
     * Update the Time class
     */
    static update() {
        Time.time += Time.deltaTime
    }
}