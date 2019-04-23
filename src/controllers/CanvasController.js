import CanvasClickHandler from '../handlers/CanvasClickHandler';
import Rectangle from "../models/Rectangle";

class CanvasController {
    constructor(canvas){
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        // Redraw on Initial Loading
        this.redraw = true;

        // Keep a collection of annotations on the canvas
        this.annotations = [];

        const canvasController = this;
        this.canvas.onmousedown = () => CanvasClickHandler.onMouseDown(canvasController, event);
        this.canvas.onmouseup = () => CanvasClickHandler.onMouseUp(canvasController, event);
        this.canvas.ondblclick = () => CanvasClickHandler.onMouseDblClick(canvasController, event);
        this.canvas.onmousemove = () => CanvasClickHandler.onMouseMove(canvasController, event);

        // Keep state of whether we are dragging or resizing the shape of an annotation
        this.isMovingAnnotation = false;
        this.isResizingAnnotation = false;
        // Keep the state of which selectionHandle was chosen
        this.selectedResizeHandle = -1;
    }

    fillWithSampleText(){
        this.context.font = "30px Arial";
        this.context.fillStyle = '#000000';
        this.context.globalAlpha = 1;
        this.context.fillText('This is a an example sentence that could be selected',5,40);
    }

    watch() {
        setInterval(() => this.draw(),20);
    }

    draw() {
        if(this.redraw){
            // Clear the existing Canvas
            this.context.clearRect(0,0, this.canvas.width, this.canvas.height);

            this.fillWithSampleText();

            let that = this;
            this.annotations.forEach(function(annotation){
                annotation.draw(that.context);
            });
        }

        this.redraw = false;
    }

    addAnnotation(x,y,width,height,color){
        const rectangle = new Rectangle(x,y, width,height,color);
        this.annotations.push(rectangle);
        this.invalidateCanvas();

        return rectangle;
    }

    invalidateCanvas() {
        this.redraw = true;
    }
}
export default CanvasController;
