/**
 * Handles the left-mouse drag-box (and single click) selection.
 * Lives on the "Player" object, which is on the "UI" layer so draw() happens in screen space.
 */
class RTSInputController extends Component {
    /** Pixels the mouse must travel before a click becomes a drag-box */
    dragThreshold = 5

    /** Current mouse position in screen pixels (undefined until the mouse first moves) */
    mousePosition

    /** Where the drag started, in WORLD space, so the box stays anchored to the map while the camera pans */
    dragStartWorld

    /** Where the drag started, in screen space (used for the click-vs-drag threshold) */
    dragStartScreen

    /** True while the left button is held down */
    isClicking = false

    /** True once the mouse has moved past dragThreshold while held down */
    isDragging = false

    start() {
        Globals.selectedUnits = []
    }

    update() {
        // Input.mousePosition is undefined until the first mousemove event
        if (!Input.mousePosition) return
        this.mousePosition = Input.mousePosition.clone()

        const additive = Input.keysDown.includes("ShiftLeft") || Input.keysDown.includes("ShiftRight")

        if (Input.mouseButtonsDownThisFrame.includes(0)) {
            this.onPress()
        }
        if (this.isClicking) {
            this.onHold()
        }
        if (Input.mouseButtonsUpThisFrame.includes(0)) {
            this.onRelease(additive)
        }

        if (!this.isClicking) {
            this.updateHover()
        }
    }

    onPress() {
        this.isClicking = true
        this.isDragging = false
        this.dragStartScreen = this.mousePosition.clone()
        this.dragStartWorld = Globals.screenToWorld(this.mousePosition)
        this.clearHover()
    }

    onHold() {
        if (!this.isDragging && this.mousePosition.minus(this.dragStartScreen).magnitude > this.dragThreshold) {
            this.isDragging = true
        }
    }

    onRelease(additive) {
        if (!this.isClicking) return // release with no matching press

        const endWorld = Globals.screenToWorld(this.mousePosition)

        if (this.isDragging) {
            this.selectInRect(this.dragStartWorld, endWorld, additive)
        } else {
            this.selectAtPoint(endWorld, additive)
        }

        this.isClicking = false
        this.isDragging = false
    }

    /** @returns {Selectable[]} every Selectable in the scene */
    getSelectables() {
        return GameObject.findGameObjectsByType(Selectable).map(go => go.getComponent(Selectable))
    }

    /**
     * Replace (or, if additive, extend) the current selection
     * @param {Selectable[]} newlySelected
     * @param {boolean} additive Shift held: keep the existing selection
     */
    applySelection(newlySelected, additive) {
        if (!additive) {
            for (const s of this.getSelectables()) {
                s.setSelected(false)
            }
            Globals.selectedUnits = []
        }
        for (const s of newlySelected) {
            s.setSelected(true)
            if (!Globals.selectedUnits.includes(s.gameObject)) {
                Globals.selectedUnits.push(s.gameObject)
            }
        }
    }

    selectInRect(worldA, worldB, additive) {
        const minX = Math.min(worldA.x, worldB.x)
        const maxX = Math.max(worldA.x, worldB.x)
        const minY = Math.min(worldA.y, worldB.y)
        const maxY = Math.max(worldA.y, worldB.y)
        const hits = this.getSelectables().filter(s => s.overlapsRect(minX, minY, maxX, maxY))
        this.applySelection(hits, additive)
    }

    selectAtPoint(worldPoint, additive) {
        // Later-instantiated objects are drawn on top, so prefer the last hit
        const hits = this.getSelectables().filter(s => s.containsPoint(worldPoint))
        const top = hits.length > 0 ? [hits[hits.length - 1]] : []
        this.applySelection(top, additive)
    }

    updateHover() {
        const world = Globals.screenToWorld(this.mousePosition)
        const selectables = this.getSelectables()
        const hits = selectables.filter(s => s.containsPoint(world))
        const top = hits[hits.length - 1]
        for (const s of selectables) {
            s.isHovered = (s === top)
        }
    }

    clearHover() {
        for (const s of this.getSelectables()) {
            s.isHovered = false
        }
    }

    /**
     * Draw the drag-box. This object is on the UI layer, so ctx is in plain screen space.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.isDragging || !this.mousePosition) return

        // Start point is stored in world space, so convert back to screen (handles camera panning mid-drag)
        const a = Globals.worldToScreen(this.dragStartWorld)
        const b = this.mousePosition

        const x = Math.min(a.x, b.x)
        const y = Math.min(a.y, b.y)
        const w = Math.abs(a.x - b.x)
        const h = Math.abs(a.y - b.y)

        ctx.save()
        ctx.fillStyle = "rgba(0, 255, 100, 0.15)"
        ctx.fillRect(x, y, w, h)
        ctx.strokeStyle = "#00ff66"
        ctx.lineWidth = 1
        ctx.strokeRect(x + 0.5, y + 0.5, w, h)
        ctx.restore()
    }
}
