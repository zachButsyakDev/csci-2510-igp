class RTSInputController extends Component {
    //dont need anything like 'mouse buttons down this frame' since alread yimplemented in Input.js
    mousePosition = []
    //we do need this so we know the origin point of the top left of our rectangle that we will be drawing
    mousePositionOnLastClick = []
    //will be used in draw to determine if we should keep drawing or if user released the mouse and thus we should stop drawing the rectangle
    isClicking = false



    start() {

    }

    update() {
        //constantly fetch mouse position
        mousePosition = Input.mousePosition

        //handle singular mouse clicks

    }

    draw() {
        //will draw polygon based on mouses last click down position and current position whenever its still clicked down


    }


}
