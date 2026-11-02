class Camera extends Component {
    backgroundColor = "white"

    static get main() {
        return GameObject.findGameObjectsWithTag("MainCamera")[0].getComponent(Camera)
    }
}