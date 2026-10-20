class UIController extends Component {
    start() {
        let player = this.scene.findGameObjectByName("Player");
        if (player) {
            this.resourceController = player.getComponent(ResourceController);
        }


        for (let obj of this.scene.gameObjects) {
            if (obj.name === "GoldText") {
                this.goldText = obj.getComponent(TextLabel);
            }
            if (obj.name === "LumberText") {
                this.lumberText = obj.getComponent(TextLabel);
            }
            if (obj.name === "FoodText") {
                this.foodText = obj.getComponent(TextLabel);
            }
        }
    }

    update() {
        if (!this.resourceController) return;

        if (this.goldText) {
            this.goldText.text = `Gold: ${Math.floor(this.resourceController.gold)}`;
        }
        if (this.lumberText) {
            this.lumberText.text = `Lumber: ${Math.floor(this.resourceController.lumber)}`;
        }
        if (this.foodText) {
            this.foodText.text = `Food: ${Math.floor(this.resourceController.food)}`;
        }
    }
}
