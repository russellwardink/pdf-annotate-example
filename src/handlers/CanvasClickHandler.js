import Positions from '../models/Positions';

class CanvasClickHandler{
    constructor(){

    }
    // Obtain the Correct MouseCoordinates based on the Canvas
    static getTrueMouseCoordinates(e) {
        let element = e.target || e.srcElement;
        let offsetX = 0;
        let offsetY = 0;

        const stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(element, null)['paddingLeft'], 10)     || 0;
        const stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(element, null)['paddingTop'], 10)      || 0;
        const styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(element, null)['borderLeftWidth'], 10) || 0;
        const styleBorderTop   = parseInt(document.defaultView.getComputedStyle(element, null)['borderTopWidth'], 10)  || 0;

        if (element.offsetParent) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }

        // Add padding and border style widths to offset
        offsetX += stylePaddingLeft;
        offsetY += stylePaddingTop;

        offsetX += styleBorderLeft;
        offsetY += styleBorderTop;

        return {
            x: e.pageX - offsetX,
            y: e.pageY - offsetY,
        }
    }

    static onMouseDown(canvasController, e){
        const coordinates = CanvasClickHandler.getTrueMouseCoordinates(e);
        const x = coordinates.x;
        const y = coordinates.y;

        // If we have selected one of the resize handles, let's tell it we're resizing and not moving
        canvasController.annotations.forEach((element) => {
            if(element.selected) {
                element.selectionHandles.forEach((handle) => {
                    if (x >= handle.x && x <= handle.x + handle.size &&
                        y >= handle.y && y <= handle.y + handle.size) {
                        // we found one!
                        canvasController.selectedResizeHandle = handle.position;
                        canvasController.isMovingAnnotation = false;
                        canvasController.isResizingAnnotation = true;
                        console.log('Found a Resize handler at ' + x + ' ' + y + ' Position: ' + handle.position);
                    }
                });
            }
        });

        // If we object detect an Annotation, let's select it
        if(!canvasController.isResizingAnnotation)  {
            canvasController.annotations.forEach((element) => {
                if(y >= element.y && y <= element.y + element.height && x >= element.x && x <= element.x + element.width) {
                    element.select();
                    canvasController.isMovingAnnotation = true;
                    console.log('Found a Annotation at ' + x + ' ' + y);
                } else {
                    element.deselect();
                }
            });
            canvasController.invalidateCanvas();
        }

    }

    static onMouseUp(canvasController, e){
        canvasController.isMovingAnnotation = false;
        canvasController.isResizingAnnotation = false;
        canvasController.selectedResizeHandle = -1;

        canvasController.invalidateCanvas();
    }

    static onMouseDblClick(canvasController, e){
        const coordinates = CanvasClickHandler.getTrueMouseCoordinates(e);
        console.log('Creating a New Annotation at: ' + coordinates.x + ' ' + coordinates.y);

       let annotation = canvasController.addAnnotation(coordinates.x,coordinates.y,100,40,'#ffff00');
       annotation.select();
    }

    static onMouseMove(canvasController, e){
        const coordinates = CanvasClickHandler.getTrueMouseCoordinates(e);
        const x = coordinates.x;
        const y = coordinates.y;

        let selectedAnnotation;

        canvasController.annotations.forEach((element) => {
            if(element.selected) {
                selectedAnnotation = element;
            }
        });

        if(selectedAnnotation){
            if(canvasController.isMovingAnnotation) {
                selectedAnnotation.x = x;
                selectedAnnotation.y = y;
            } else if(canvasController.isResizingAnnotation) {
                // 0  1  2
                // 3     4
                // 5  6  7
                switch (canvasController.selectedResizeHandle) {
                    case Positions.TOP_LEFT:
                        selectedAnnotation.width += selectedAnnotation.x - x;
                        selectedAnnotation.height += selectedAnnotation.y - y;
                        selectedAnnotation.x = x;
                        selectedAnnotation.y = y;
                        break;

                    case Positions.TOP_MIDDLE:
                        selectedAnnotation.height += selectedAnnotation.y - y;
                        selectedAnnotation.y = y;
                        break;

                    case Positions.TOP_RIGHT:
                        selectedAnnotation.width = x - selectedAnnotation.x;
                        selectedAnnotation.height += selectedAnnotation.y - y;
                        selectedAnnotation.y = y;
                        break;

                    case Positions.MIDDLE_LEFT:
                        selectedAnnotation.width += selectedAnnotation.x - x;
                        selectedAnnotation.x = x;
                        break;

                    case Positions.MIDDLE_RIGHT:
                        selectedAnnotation.width = x - selectedAnnotation.x;
                        break;

                    case Positions.BOTTOM_LEFT:
                        selectedAnnotation.width += selectedAnnotation.x - x;
                        selectedAnnotation.height = y - selectedAnnotation.y;
                        selectedAnnotation.x = x;
                        break;

                    case Positions.BOTTOM_MIDDLE:
                        selectedAnnotation.height = y - selectedAnnotation.y;
                        break;

                    case Positions.BOTTOM_RIGHT:
                        selectedAnnotation.width =  x - selectedAnnotation.x;
                        selectedAnnotation.height = y - selectedAnnotation.y;
                        break;
                }
            }
            canvasController.invalidateCanvas();
        }

    }

}

export default CanvasClickHandler;



