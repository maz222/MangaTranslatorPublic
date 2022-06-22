import React, { useEffect, useState } from 'react';

/*
    HTML Canvas for display image and text boxes

    Props:
        width: (int) the width of the canvas (in pixels)
        height: (int) the height of the canvas (in pixels)
        image : (Image) the image to be displayed on the canvas
        text : ([{raw,translated,rect},...]) an array of objects, each representing a text detection within the image, to be overlayed over the image
            - raw : (string) the raw, untranslated text detected in the image
            - translated : (string) the translated text
            - rect : ({x,y,width,height}) the positional data for the text. x/y are top left corner. in pixels.
        containerRef : (DOM Reference) a reference to this element's parent. used to determine the margin between the image and the canvas
        clickCallback : (function) function called when user clicks on an active textbox. Updates the bottom text bar to the appropriate text
    
    State:
        activeText : ({raw,translated,rect}) the current text object that the user is hovering over
        canvasRef : (DOM Reference) a reference to the actual html canvas. used to control/display the actual canvas content
*/
function ImageCanvas(props) {
    const canvasRef = React.useRef(null);
    const [activeText, setActiveText] = useState(null);
    //calculates the actual canvas dimensions, image dimensions (scaled), aspect ratio of the canvas, and the offset for the image (to center in the canvas)
    var calcDimensions = () => {
        //place a 10 pixel margin around the image within the canvas
        const margin = 10;
        const aspectRatio = Math.min((props.width-margin)/props.image.width,1);
        const canvasDimensions = {width:Math.max(props.width,props.image.width*aspectRatio+margin*2),height:Math.max(props.height,props.image.height*aspectRatio+margin*2)};
        const imageSize = {width:props.image.width*aspectRatio, height:props.image.height*aspectRatio};
        const imageOffset = {x:(canvasDimensions.width-imageSize.width+margin/2)/2, y:(canvasDimensions.height-imageSize.height+margin/2)/2};
        return {canvasDimensions:canvasDimensions,aspectRatio:aspectRatio, imageSize:imageSize, imageOffset:imageOffset};
    }
    //renders the initial canvas upon mounting this component
    var renderCanvas = () => {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext("2d");
        //get canvas and image dimensions
        const dimensions = calcDimensions();
        //draw the image centered in the canvas, and scaled to fit the width of the canvas
        canvasContext.strokeStyle = "#000000";
        canvasContext.drawImage(props.image,dimensions.imageOffset.x,dimensions.imageOffset.y,dimensions.imageSize.width,dimensions.imageSize.height);
        canvasContext.beginPath();
        canvasContext.rect(dimensions.imageOffset.x,dimensions.imageOffset.height,dimensions.imageSize.width,dimensions.imageSize.height);
        canvasContext.closePath();
        canvasContext.stroke();

        canvasContext.strokeStyle = "#FF0000";
        //draw the individual text boxes to indicate detected text within the image
        for(var t in props.text) {
            const textRect = props.text[t].rect;
            canvasContext.beginPath();
            canvasContext.rect(textRect.x*dimensions.aspectRatio + dimensions.imageOffset.x,textRect.y*dimensions.aspectRatio + dimensions.imageOffset.y, 
                textRect.width*dimensions.aspectRatio, textRect.height*dimensions.aspectRatio);
            canvasContext.closePath();
            canvasContext.stroke();
        }
    }
    //re-renders the canvas (for when user clicks on a text box)
    var redrawCanvas = () => {
        //render the image and original boxes. if no box is active, exit
        renderCanvas();
        if(activeText == null) {
            return;
        }
        const dimensions = calcDimensions();
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext("2d");
        canvasContext.beginPath();
        //draw a different colored text box to indicate that the user has clicked on / activated the text box
        const textRect = activeText.rect;
        canvasContext.rect(textRect.x*dimensions.aspectRatio + dimensions.imageOffset.x,
            textRect.y*dimensions.aspectRatio + dimensions.imageOffset.y, 
            textRect.width*dimensions.aspectRatio, textRect.height*dimensions.aspectRatio);
        canvasContext.closePath();
        canvasContext.strokeStyle = "#FFFF00";
        canvasContext.stroke();
    }
    //handles when the user moves the cursor over the canvas. highlights text boxes when they are hovered over
    var handleMove = (e) => {
        //normalize the cursor position within the image
        //the text boxes are stored with raw pixel values relative to the size of the original image
        //since the image may be resized to fit the canvas, the cursor position must be adjusted 
        const margin = 10;
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext("2d");
        const dimensions = props.containerRef.current.getBoundingClientRect();
        const aspectRatio = Math.min((dimensions.width-margin)/props.image.width,(dimensions.height-margin)/props.image.height,1);
        const imageSize = [props.image.width*aspectRatio,props.image.height*aspectRatio];
        const imageOffset = [(dimensions.width+margin/2-imageSize[0])/2, (dimensions.height-imageSize[1]+margin/2)/2];
        const cursorPos = {x:e.clientX - dimensions.left - imageOffset[0], y:e.clientY - dimensions.top - imageOffset[1]};
        //check each text box to see if the user is hovering over it
        var boxFound = false;
        for(var t in props.text) {
            const textBox = props.text[t].rect;
            if(cursorPos.x >= textBox.x*aspectRatio && cursorPos.x <= (textBox.x+textBox.width)*aspectRatio) {
                if(cursorPos.y >= textBox.y*aspectRatio && cursorPos.y <= (textBox.y+textBox.height)*aspectRatio) {
                    boxFound = true;
                    //if a box is found / hovered, update the active text box to it
                    if(activeText == null || activeText.rect.x != textBox.x || activeText.rect.y != textBox.y || activeText.rect.width != textBox.width || activeText.rect.height != textBox.height) {
                        setActiveText(props.text[t]);
                    }
                }
            }
        }
        //if no box is found, update active text box to (no box)
        if(!boxFound) {
            setActiveText(null);
        }
    }
    //redraws the canvas if the active text box changes
    useEffect(() => {
        redrawCanvas();
    },[activeText]);
    //when the user clicks on a text box, use the callback to udpate the bottom text bar
    var handleClick = (e) => {
        //console.log(props);
        if(activeText != null) {
            props.clickCallback(activeText);
        }
    }
    const canvasDimensions = calcDimensions().canvasDimensions;
    return(
        <canvas id="imageCanvas" ref={canvasRef} style={{backgroundColor:"#0F1831"}}
        width={props.width} height={props.height} 
        onMouseMove={(e) => {handleMove(e)}} onClick={(e) => {handleClick(e)}}/>
    )
}

export default ImageCanvas;