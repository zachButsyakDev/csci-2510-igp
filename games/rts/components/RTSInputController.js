/**
 * Handles the left-mouse drag-box (and single click) selection.
 * Lives on the "Player" object, which is on the "UI" layer so draw() happens in screen space.
 *
 * Building mode:
 *   1 → place GoldMine
 *   2 → place LumberYard
 *   3 → place Farm
 *   Escape → cancel building mode
 *   Left-click (while in building mode) → place the building, exit mode
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

    /**
     * The ghost GameObject currently following the mouse, or null when not in
     * building mode.
     * @type {GameObject|null}
     */
    buildingGhost = null

    start() {
        Globals.selectedUnits = []
    }

    update() {
        // Input.mousePosition is undefined until the first mousemove event
        if (!Input.mousePosition) return
        this.mousePosition = Input.mousePosition.clone()

        // --- Building mode hotkeys ---
        if (Input.keysDownThisFrame.includes("Digit1")) this.enterBuildingMode("GoldMine")
        if (Input.keysDownThisFrame.includes("Digit2")) this.enterBuildingMode("LumberYard")
        if (Input.keysDownThisFrame.includes("Digit3")) this.enterBuildingMode("Farm")
        if (Input.keysDownThisFrame.includes("Escape")) this.cancelBuildingMode()

        // --- While in building mode left-click places the building ---
        if (this.buildingGhost) {
            if (Input.mouseButtonsDownThisFrame.includes(0)) {
                this.placeBuilding()
            }
            // Don't run normal selection logic while placing
            return
        }

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

        // Right-click: move selected units to target location
        if (Input.mouseButtonsDownThisFrame.includes(2)) {
            this.onRightClick()
        }

        if (!this.isClicking) {
            this.updateHover()
        }
    }

    // -----------------------------------------------------------------------
    // Building placement
    // -----------------------------------------------------------------------

    /**
     * Enter building placement mode for the given type.
     * Destroys any existing ghost first so pressing 1 then 2 swaps cleanly.
     * @param {"GoldMine"|"LumberYard"|"Farm"} type
     */
    enterBuildingMode(type) {
        this.cancelBuildingMode()

        // Ghost uses a semi-transparent version of each building's color
        const configs = {
            GoldMine:   { color: "rgba(255, 215, 0, 0.5)",   size: 8 },
            LumberYard: { color: "rgba(165, 42, 42, 0.5)",   size: 8 },
            Farm:       { color: "rgba(0, 128, 0, 0.5)",     size: 8 },
        }
        const { color, size } = configs[type]

        const ghost = new GameObject("BuildingGhost", ["BuildingGhost"], "default")
        ghost.addComponent(new Polygon(), { fillStyle: color, points: Assets.square })
        ghost.transform.scale = new Vector2(size, size)
        ghost.addComponent(new Buildable(type))

        instantiate(ghost, Globals.screenToWorld(this.mousePosition))
        this.buildingGhost = ghost
    }

    /** Destroy the ghost and exit building mode without placing anything. */
    cancelBuildingMode() {
        if (this.buildingGhost) {
            this.buildingGhost.markForDestroy = true
            this.buildingGhost = null
        }
    }

    /** Place the real building at the ghost's current world position, then exit mode. */
    placeBuilding() {
        const pos = this.buildingGhost.transform.position.clone()
        const type = this.buildingGhost.getComponent(Buildable).buildingType

        this.cancelBuildingMode()

        const constructors = {
            GoldMine:   () => new GoldMine(),
            LumberYard: () => new LumberYard(),
            Farm:       () => new Farm(),
        }
        instantiate(constructors[type](), pos)
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
     * Handle right-click: move all selected units to the clicked world position
     */
    onRightClick() {
        if (Globals.selectedUnits.length === 0) return
        
        const targetWorld = Globals.screenToWorld(this.mousePosition)
        
        // Issue move command to all selected units that have a UnitController
        for (const unit of Globals.selectedUnits) {
            const controller = unit.getComponent(UnitController)
            if (controller) {
                controller.moveTo(targetWorld)
            }
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
