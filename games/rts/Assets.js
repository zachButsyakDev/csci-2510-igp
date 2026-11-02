class Assets {
    static triangle = [
        new Vector2(0, -20),
        new Vector2(10, 10),
        new Vector2(-10, 10),
    ]

    // Was a degenerate shape (points were all on one diagonal line). Now an actual 20x20 square.
    static square = [
        new Vector2(-10, -10),
        new Vector2(10, -10),
        new Vector2(10, 10),
        new Vector2(-10, 10),
    ]
}
