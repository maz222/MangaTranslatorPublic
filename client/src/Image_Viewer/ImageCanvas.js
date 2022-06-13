import React, { useEffect, useState } from 'react';

//HTML Canvas for display image and text boxes
function ImageCanvas(props) {
    const canvasRef = React.useRef(null);
    const [activeText, setActiveText] = useState(null);
    var calcDimensions = () => {
        const margin = 10;
        const aspectRatio = Math.min((props.width-margin)/props.image.width,1);
        const canvasDimensions = {width:Math.max(props.width,props.image.width*aspectRatio+margin*2),height:Math.max(props.height,props.image.height*aspectRatio+margin*2)};
        const imageSize = {width:props.image.width*aspectRatio, height:props.image.height*aspectRatio};
        const imageOffset = {x:(canvasDimensions.width-imageSize.width+margin/2)/2, y:(canvasDimensions.height-imageSize.height+margin/2)/2};
        return {canvasDimensions:canvasDimensions,aspectRatio:aspectRatio, imageSize:imageSize, imageOffset:imageOffset};
    }
    var renderCanvas = () => {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext("2d");
        const dimensions = calcDimensions();
        canvasContext.strokeStyle = "#000000";
        canvasContext.drawImage(props.image,dimensions.imageOffset.x,dimensions.imageOffset.y,dimensions.imageSize.width,dimensions.imageSize.height);
        canvasContext.beginPath();
        canvasContext.rect(dimensions.imageOffset.x,dimensions.imageOffset.height,dimensions.imageSize.width,dimensions.imageSize.height);
        canvasContext.closePath();
        canvasContext.stroke();

        canvasContext.strokeStyle = "#FF0000";
        //draw text recs
        for(var t in props.text) {
            const textRect = props.text[t].rect;
            canvasContext.beginPath();
            canvasContext.rect(textRect.x*dimensions.aspectRatio + dimensions.imageOffset.x,textRect.y*dimensions.aspectRatio + dimensions.imageOffset.y, 
                textRect.width*dimensions.aspectRatio, textRect.height*dimensions.aspectRatio);
            canvasContext.closePath();
            canvasContext.stroke();
        }
    }

    var redrawCanvas = () => {
        renderCanvas();
        if(activeText == null) {
            return;
        }
        const dimensions = calcDimensions();
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext("2d");
        canvasContext.beginPath();
        const textRect = activeText.rect;
        canvasContext.rect(textRect.x*dimensions.aspectRatio + dimensions.imageOffset.x,
            textRect.y*dimensions.aspectRatio + dimensions.imageOffset.y, 
            textRect.width*dimensions.aspectRatio, textRect.height*dimensions.aspectRatio);
        canvasContext.closePath();
        canvasContext.strokeStyle = "#FFFF00";
        canvasContext.stroke();
    }
    
    var handleMove = (e) => {
        //return;
        const margin = 10;
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext("2d");
        //const dimensions = calcDimensions();
        const dimensions = props.containerRef.current.getBoundingClientRect();
        const aspectRatio = Math.min((dimensions.width-margin)/props.image.width,(dimensions.height-margin)/props.image.height,1);
        const imageSize = [props.image.width*aspectRatio,props.image.height*aspectRatio];
        const imageOffset = [(dimensions.width+margin/2-imageSize[0])/2, (dimensions.height-imageSize[1]+margin/2)/2];
        const cursorPos = {x:e.clientX - dimensions.left - imageOffset[0], y:e.clientY - dimensions.top - imageOffset[1]};
        //console.log(cursorPos);
        var boxFound = false;
        for(var t in props.text) {
            const textBox = props.text[t].rect;
            if(cursorPos.x >= textBox.x*aspectRatio && cursorPos.x <= (textBox.x+textBox.width)*aspectRatio) {
                if(cursorPos.y >= textBox.y*aspectRatio && cursorPos.y <= (textBox.y+textBox.height)*aspectRatio) {
                    boxFound = true;
                    if(activeText == null || activeText.rect.x != textBox.x || activeText.rect.y != textBox.y || activeText.rect.width != textBox.width || activeText.rect.height != textBox.height) {
                        setActiveText(props.text[t]);
                        //console.log("found box");
                    }
                }
            }
        }
        if(!boxFound) {
            setActiveText(null);
        }
    }
    useEffect(() => {
        redrawCanvas();
    },[activeText]);

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