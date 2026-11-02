/**
 * Pushes the player's resource counts into the HUD text objects.
 * Expects game objects named "Player", "GoldText", "LumberText" and "FoodText".
 */
class UIController extends Component {
    resourceController
    goldText
    lumberText
    foodText

    start() {
        this.findReferences()
    }

    // Look things up by name. Safe to call every frame until everything is found.
    findReferences() {
        if (!this.resourceController) {
            this.resourceController = GameObject.find("Player")?.getComponent(ResourceController)
        }
        if (!this.goldText) this.goldText = GameObject.find("GoldText")?.getComponent(TextLabel)
        if (!this.lumberText) this.lumberText = GameObject.find("LumberText")?.getComponent(TextLabel)
        if (!this.foodText) this.foodText = GameObject.find("FoodText")?.getComponent(TextLabel)
    }

    update() {
        this.findReferences()
        if (!this.resourceController) return

        if (this.goldText) {
            this.goldText.text = `Gold: ${Math.floor(this.resourceController.gold)}`
        }
        if (this.lumberText) {
            this.lumberText.text = `Lumber: ${Math.floor(this.resourceController.lumber)}`
        }
        if (this.foodText) {
            this.foodText.text = `Food: ${Math.floor(this.resourceController.food)}`
        }
    }
}
