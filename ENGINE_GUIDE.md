# Engine How-To Guide

## The Big Picture

Every frame the engine runs this loop:

```
SceneManager.update()   ← swap in a new scene if one was requested
Engine.update()         ← calls start() then update() on every GameObject
Engine.draw()           ← clears the canvas, then calls draw() on every GameObject
Time.update()           ← advances the clock
```

Your job as a game developer is to write **Scenes**, **GameObjects**, and **Components**, then wire them up in an HTML file.

---

## Step 1 — The HTML File

Every game needs one HTML file. Its only jobs are to load scripts in the right order and call `Engine.start()`.

```html
<!doctype html>
<html>
<head>
    <style>* { margin: 0; overflow: hidden; }</style>
</head>
<body>
    <canvas id="canv"></canvas>

    <!-- 1. Engine core — always in this exact order -->
    <script src="../../engine/Vector2.js"></script>
    <script src="../../engine/Input.js"></script>
    <script src="../../engine/Engine.js"></script>
    <script src="../../engine/Component.js"></script>
    <script src="../../engine/GameObject.js"></script>
    <script src="../../engine/Scene.js"></script>
    <script src="../../engine/SceneManager.js"></script>
    <script src="../../engine/Time.js"></script>

    <!-- 2. Engine components -->
    <script src="../../engine/components/Transform.js"></script>
    <script src="../../engine/components/Polygon.js"></script>
    <script src="../../engine/components/TextLabel.js"></script>
    <script src="../../engine/components/Camera.js"></script>

    <!-- 3. Your game files — components before gameObjects before scenes -->
    <script src="./components/MyComponent.js"></script>
    <script src="./gameObjects/MyGameObject.js"></script>
    <script src="./scenes/MyScene.js"></script>

    <!-- 4. Kick it off -->
    <script>
        Engine.start(MyScene)
    </script>
</body>
</html>
```

**Load order matters.** A class must be defined before anything that uses it. So: engine first, then your components, then your GameObjects (which use components), then your Scenes (which use GameObjects).

---

## Step 2 — Scenes

A Scene is a level or screen. It holds a list of GameObjects. You create one by extending `Scene`.

```js
class MyScene extends Scene {
    constructor() {
        super() // ALWAYS call super() first — it creates the camera

        // Place objects here using this.instantiate()
        this.instantiate(new MyGameObject(), new Vector2(100, 200))
        this.instantiate(new MyGameObject(), new Vector2(300, 200))
    }

    // Optional — runs every frame AFTER the scene is live
    // Safe to use Camera.main here. NOT safe in the constructor.
    start() {
        super.start() // don't skip this — it starts all GameObjects
        Camera.main.backgroundColor = "skyblue"
    }
}
```

**`this.instantiate(gameObject, position, rotation)`**
Adds a GameObject to the scene and sets its starting position and rotation. Position defaults to `(0,0)`, rotation defaults to `0`. Returns the GameObject.

**Why can't I use `Camera.main` in the constructor?**
`Camera.main` searches `SceneManager.currentScene`, but during the constructor the scene isn't the current scene yet — it's still being built. Wait until `start()`.

**Switching scenes at runtime:**
```js
SceneManager.loadScene(OtherScene)        // replace current scene
SceneManager.loadScene(OtherScene, true)  // additive — merge into current scene
```

---

## Step 3 — GameObjects

A GameObject is a thing in your game — a player, an enemy, a bullet, a platform. It's just a named container for Components.

```js
class BulletGameObject extends GameObject {
    constructor() {
        // super(name, tags[], layer)
        super("Bullet", ["Bullet"], "default")

        // Attach components
        this.addComponent(new Polygon(), {
            fillStyle: "yellow",
            points: [
                new Vector2(-3, -6),
                new Vector2( 3, -6),
                new Vector2( 3,  6),
                new Vector2(-3,  6),
            ]
        })

        this.addComponent(new BulletMover())
    }
}
```

**`super(name, tags, layer)`**
- `name` — string identifier, used by `GameObject.find(name)`
- `tags` — array of strings, used by `GameObject.findGameObjectsWithTag(tag)`
- `layer` — which draw layer to render on (see Layers section). Defaults to `"default"`. Use `"UI"` for HUD elements.

**`this.addComponent(component, parameters)`**
Attaches a component. The optional `parameters` object is a shortcut to set properties on the component inline — `{ fillStyle: "red", points: [...] }` is the same as setting those properties manually after the fact.

**Useful static methods (call these from anywhere):**
```js
GameObject.find("Player")                     // find by name
GameObject.findGameObjectsWithTag("Enemy")    // find all with a tag, returns array
GameObject.findGameObjectsByType(MyComponent) // find all that have a component type
```

**Destroying a GameObject:**
```js
this.gameObject.destroy() // from inside a component
someGameObject.destroy()  // from anywhere with a reference
```
It won't disappear instantly — it's removed at the end of the current frame's update.

**Spawning a new object at runtime** (from inside a component):
```js
instantiate(new BulletGameObject(), this.transform.position.clone())
```
Note: `instantiate` (lowercase) is a global function. `this.instantiate` only exists on Scene.

---

## Step 4 — Components

Components are where all your logic lives. A Component is a class that extends `Component` and can define three optional methods: `start()`, `update()`, and `draw()`.

```js
class Mover extends Component {
    speed = 200  // you can declare properties like this

    start() {
        // Runs ONCE, the first time this component's GameObject is updated.
        // Good for initialization.
        this.initialX = this.transform.position.x
    }

    update() {
        // Runs EVERY FRAME.
        // Put movement, input, physics, game logic here.
        this.transform.position.x += this.speed * Time.deltaTime
    }

    draw(ctx) {
        // Runs EVERY FRAME after update.
        // ctx is the raw Canvas 2D context.
        // Only needed if you want fully custom drawing.
        // Most of the time you use Polygon or TextLabel instead.
    }
}
```

**`this.transform`** — shortcut to the parent GameObject's Transform component (position, scale, rotation).

**`this.gameObject`** — reference back to the parent GameObject. Use this to call `this.gameObject.destroy()`, `this.gameObject.getComponent(...)`, etc.

**`this.gameObject.getComponent(Type)`** — get another component on the same object:
```js
let poly = this.gameObject.getComponent(Polygon)
poly.fillStyle = "blue"
```

**`this.gameObject.broadcastMessage("methodName", [arg1, arg2])`** — calls a method by name on every component that has it. Useful for events like "take damage":
```js
// sender
enemy.broadcastMessage("takeDamage", [10])

// receiver component on the enemy
class Health extends Component {
    hp = 100
    takeDamage(amount) {
        this.hp -= amount
    }
}
```

---

## Step 5 — Transform

Every GameObject automatically has a `Transform` as its very first component. You never add it manually.

```js
this.transform.position          // Vector2 — where the object is in world space
this.transform.position.x        // read or write individual axes
this.transform.position.y

this.transform.scale             // Vector2 — (1,1) is normal size
this.transform.scale = new Vector2(2, 2)  // double size

this.transform.rotation          // Number — angle in RADIANS, not degrees
this.transform.rotation = Math.PI / 4    // 45 degrees
```

---

## Step 6 — Vector2

Used everywhere positions, directions, and sizes appear.

```js
new Vector2(x, y)

v.x  v.y              // read/write the components directly

v.plus(other)         // returns a NEW Vector2 (doesn't modify v)
v.minus(other)        // returns a NEW Vector2

v.magnitude           // length of the vector (read-only getter)

v.clone()             // returns a copy — important when passing positions around
                      // without clone(), two things share the same object reference
```

**Important:** `plus` and `minus` are non-destructive — they return a new Vector2. To move an object, you must write back:
```js
// WRONG — does nothing useful
this.transform.position.plus(new Vector2(5, 0))

// RIGHT
this.transform.position = this.transform.position.plus(new Vector2(5, 0))

// ALSO RIGHT — direct mutation
this.transform.position.x += 5
```

---

## Step 7 — Input

`Input.keysDown` is an array of strings representing every key currently held down. Check it in any component's `update()`.

```js
if (Input.keysDown.includes("ArrowRight")) { ... }
if (Input.keysDown.includes("ArrowLeft"))  { ... }
if (Input.keysDown.includes("ArrowUp"))    { ... }
if (Input.keysDown.includes("ArrowDown"))  { ... }
if (Input.keysDown.includes("Space"))      { ... }
if (Input.keysDown.includes("KeyA"))       { ... }  // WASD
if (Input.keysDown.includes("KeyW"))       { ... }
```

The string values are browser `KeyboardEvent.code` values — physical key position, not character. See [MDN Key Values](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values) for the full list.

---

## Step 8 — Time

Use `Time.deltaTime` to make movement frame-rate independent. If you move by a fixed number of pixels per frame, the game runs faster on faster machines. Multiply by `deltaTime` to move in units per second instead.

```js
// BAD — speed depends on frame rate
this.transform.position.x += 3

// GOOD — 180 pixels per second regardless of frame rate
this.transform.position.x += 180 * Time.deltaTime
```

`Time.deltaTime` is hardcoded to `1/60` (approximately 16ms). `Time.time` is the total elapsed time in seconds since the game started — useful for animations or timed events.

---

## Step 9 — Built-in Components

### Polygon
Draws a filled polygon shape. Points are defined relative to the object's position — `(0,0)` is the object's center.

```js
this.addComponent(new Polygon(), {
    fillStyle: "#ff0000",   // any CSS color string
    points: [
        new Vector2(0, -20),   // top
        new Vector2(15, 15),   // bottom right
        new Vector2(-15, 15),  // bottom left
    ]
})
```

The polygon is affected by the Transform's position, rotation, and scale.

### TextLabel
Draws a string of text.

```js
this.addComponent(new TextLabel(), {
    text: "Score: 0",
    fillStyle: "white",
    font: "bold 20px monospace"  // standard CSS font string
})
```

To update text at runtime, get the component and set `.text`:
```js
let label = this.gameObject.getComponent(TextLabel)
label.text = "Score: " + this.score
```

### Camera
There is always exactly one camera, created automatically by `Scene`. You interact with it through `Camera.main`.

```js
Camera.main.backgroundColor = "#87ceeb"  // background fill color

// Move the camera (e.g., follow the player):
Camera.main.transform.position = this.transform.position.clone()
```

The camera position is the world-space point that maps to the center of the screen. Moving the camera right moves the world left on screen.

**Only use `Camera.main` in `start()` or `update()`, never in a Scene or GameObject constructor.**

---

## Step 10 — Layers

By default there are two layers: `"default"` and `"UI"`.

- `"default"` objects are drawn in world space — they move with the camera.
- `"UI"` objects are drawn in screen space — they stay fixed on screen regardless of camera position. Use this for HUD elements, score displays, menus.

```js
// Set layer in the GameObject constructor
super("ScoreDisplay", [], "UI")
```

You can define custom layers by passing a Settings object to `Engine.start`:

```js
// Settings.js
class Settings {
    static layers = ["background", "default", "enemies", "UI"]
}

// HTML
Engine.start(MyScene, Settings)
```

Objects are drawn in the order layers are listed. Objects in a layer listed earlier appear behind objects in later layers. `"UI"` is always drawn last (on top), regardless of where it appears in the array.

---

## Putting It All Together — A Moving Character

Here's the complete minimal example of a character you can move with arrow keys:

**`components/MoveComponent.js`**
```js
class MoveComponent extends Component {
    speed = 150

    update() {
        if (Input.keysDown.includes("ArrowRight"))
            this.transform.position.x += this.speed * Time.deltaTime

        if (Input.keysDown.includes("ArrowLeft"))
            this.transform.position.x -= this.speed * Time.deltaTime

        if (Input.keysDown.includes("ArrowUp"))
            this.transform.position.y -= this.speed * Time.deltaTime

        if (Input.keysDown.includes("ArrowDown"))
            this.transform.position.y += this.speed * Time.deltaTime

        // Camera follows the player
        Camera.main.transform.position = this.transform.position.clone()
    }
}
```

**`gameObjects/PlayerGameObject.js`**
```js
class PlayerGameObject extends GameObject {
    constructor() {
        super("Player", ["Player"])

        this.addComponent(new Polygon(), {
            fillStyle: "red",
            points: [
                new Vector2(0, -15),
                new Vector2(10, 10),
                new Vector2(-10, 10),
            ]
        })

        this.addComponent(new MoveComponent())
    }
}
```

**`scenes/GameScene.js`**
```js
class GameScene extends Scene {
    constructor() {
        super()
        this.instantiate(new PlayerGameObject(), new Vector2(0, 0))
    }

    start() {
        super.start()
        Camera.main.backgroundColor = "#222222"
    }
}
```

---

## Common Gotchas

- **`Camera.main` in a constructor** — crashes because `SceneManager.currentScene` isn't set yet. Move it to `start()`.
- **Forgetting `super()` in a Scene or GameObject** — the camera won't be created, everything breaks.
- **Forgetting `super.start()` in an overridden `start()`** — your GameObjects will never call their own `start()`.
- **Modifying `transform.position` directly vs replacing it** — `this.transform.position.x += 5` works. `this.transform.position = this.transform.position.plus(...)` also works. `this.transform.position.plus(...)` with no assignment does nothing.
- **Not cloning positions** — `Camera.main.transform.position = this.transform.position` makes the camera share the same Vector2 object as the player. Later mutations to one affect the other. Use `.clone()`.
- **Script load order** — if you get "X is not defined", a file loaded before the file that defines X. Check your `<script>` tag order in the HTML.
- **`start()` runs every frame** — it's called by the engine each frame, but `component.start()` is guarded by `didStart` so component start methods only fire once. Scene-level `start()` overrides have no such guard, so keep them idempotent (setting a color every frame is fine; spawning objects every frame is not).
