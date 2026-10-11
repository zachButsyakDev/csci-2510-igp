class LevelController extends Component {
    constructor(condition, nextScene) {
        super()
        this.condition = condition
        this.nextScene = nextScene
    }



    start() {

    }

    update() {
        if(this.condition && this.condition()) {
            SceneManager.loadScene(this.nextScene)
        }
    }
}
