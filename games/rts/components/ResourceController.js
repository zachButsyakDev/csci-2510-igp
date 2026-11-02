class ResourceController extends Component {

    constructor() {
        super();
        this.gold = 100;
        this.bonusGoldRate = 0;
        this.food = 150;
        this.bonusFoodRate = 2;
        this.lumber = 100;
        this.bonusLumberRate = 0;

    }

    start() {

    }

    update() {
        this.gold += this.bonusGoldRate * Time.deltaTime;
        this.lumber += this.bonusLumberRate * Time.deltaTime;
        this.food += this.bonusFoodRate * Time.deltaTime;

    }

    addGoldRate(amount) {
        this.bonusGoldRate += amount;
    }

    removeGoldRate(amount) {
        this.bonusGoldRate = Math.max(0, this.bonusGoldRate - amount);
    }

    addFoodRate(amount) {
        this.bonusFoodRate += amount;
    }

    removeFoodRate(amount) {
        this.bonusFoodRate = Math.max(0, this.bonusFoodRate - amount);
    }

    addLumberRate(amount) {
        this.bonusLumberRate += amount;
    }

    removeLumberRate(amount) {
        this.bonusLumberRate = Math.max(0, this.bonusLumberRate - amount);
    }
}
