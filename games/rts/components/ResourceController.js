class ResourceController extends Component {

    constructor() {
        super();
        this.gold = 100;
        this.bonusGoldRate = 0;
        this.food = 150;
        this.bonusFoodRate = 2;
        this.lumber = 100;
        this.bonusLumberRate = 0;
        this.goldMines = [];
        this.farms = [];
        this.lumberYards = [];
    }

    start() {
        
    }

    update() {
        //calculate updates to bonus rates
        //this.gameObject.scene.findGameObjectsWithTag(farm, goldmine, lumberyard)
        this.goldMines = GameObject.findGameObjectsWithTag("GoldMine");
        this.farms = GameObject.findGameObjectsWithTag("Farm");
        this.lumberYards = GameObject.findGameObjectsWithTag("LumberYard");
        
        //update bonus rates
        this.updateGoldRate(this.goldMines.length * 2)
        this.updateFoodRate(this.farms.length * 10)
        this.updateLumberRate(this.lumberYards.length * 3)
        
        this.gold += this.bonusGoldRate * Time.deltaTime;
        this.lumber += this.bonusLumberRate * Time.deltaTime;
        this.food += this.bonusFoodRate * Time.deltaTime;
        

    }

    updateGoldRate(amount) {
        this.bonusGoldRate = amount;
    }
    updateFoodRate(amount) {
        this.bonusFoodRate = amount;
    }
    updateLumberRate(amount) {
        this.bonusLumberRate = amount;
    }
}
