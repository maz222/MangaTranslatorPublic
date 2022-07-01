import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import ImageCanvas from './ImageCanvas';

//default text
const readyText = "Click on a text box to see the translation!";
const loadingText = "Translating...";

//basic empty, blue page with flex box centering
const StyledPage = styled.div`
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color:#0F1831;
`;

//the top banner
const Banner = styled.div`
    height:40px;
    padding:10px;

    width:100%;
    background-color:#03050A;
    display:flex;
    align-items:center;
    position: fixed;

    button {
        border:0;
        background-color:rgba(0,0,0,0);
        color:white;
        font-size:1.5em;
    }
`;

//the navigation menu for browsing images (next image, previous image)
const NavMenu = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    color:white;
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    button {
        color:white;
        background-color:rgba(0,0,0,0);
        border:0;
        &:hover {
            cursor:pointer;
        }
    }

    h3 {
        margin: 0 10px 0 10px;
    }
`;

//text bar for displaying the current active text box
const TextBar = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    padding:20px;
    position:fixed;
    top:calc(100% - 100px);
    background-color:rgb(240,240,240);
    width:80%;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    border:1px solid rgba(0,0,0,.5);
    h4 {
        overflow-wrap:anywhere;
        width:100%;
        padding:0;
        margin:0;
    }
`;

/*
    The page element for viewing translated images.
    Contains a navigation bar, the canvas element (with image and text boxes), and a bottom bar for displaying the translated text

    Props:
        userImages: [{UserImage},...]
            -UserImage: {imageFile:{rawFile,blob,image},imageText:{(Image Text)}}
                -imageFile : the file data for the user image
                    -rawFile : the raw user file
                    -blob : parsed b24 data from the user file
                    -image : (Image) created from the file data
                -imageText : ([{raw,translated,rect},...]) an array of objects, each representing a text detection within the image, to be overlayed over the image
                    - raw : (string) the raw, untranslated text detected in the image
                    - translated : (string) the translated text
                    - rect : ({x,y,width,height}) the positional data for the text. x/y are top left corner. in pixels.
        setUserImages : (function) function for setting App's userImages
        activeImageIndex : (int) the index of the image the user is currently interacting with
        setActiveImageIndex : (function) function for setting App's activeImageIndex

    State:
        image: (Image) the current active image being displayed
        text: ({raw,translated,rect},...) array of objects, each representing a text detection within the image, to be overlayed over the image
            - raw : (string) the raw, untranslated text detected in the image
            - translated : (string) the translated text
            - rect : ({x,y,width,height}) the positional data for the text. x/y are top left corner. in pixels.        activeText:
        APIError: (bool) whether the client has encountered an error when calling the API or not
        canvasDimensions: {width, height} the dimensions of the canvas element, in pixels
        baseDimensions: {width, height} the dimensions of the container element for the canvas. used to help determine the scaled dimensions of the canvas
        containerRef : (DOM Reference) a reference to the container element for the canvas (used to get baseDimensions)
*/
function ImagePageFunction(props) {
    //const location = useLocation();
    const containerRef = useRef();

    //const [image, setImage] = useState(null);
    //const [text, setText] = useState(null);
    const [activeText, setActiveText] = useState(null);
    const [APIError, setError] = useState(false);
    const [canvasDimensions, setCanvasDimentions] = useState(null)
    const [baseDimensions, setBaseDimensions] = useState(null);

    //calls the API to get the translated text within an image
    const translateImage = (image) => {
        const API_URL = "/api/detectText";
        const form = new FormData();
        form.append('file',image);
        //make a post request to the API, passing in the image file data (detects data in the image using Google Cloudvision)
        axios.post(API_URL,form,{headers: {"Content-Type":"multipart/form-data"}}).then((res) => {
            //create a temp array of the raw detected text in the image
            var targetText = [];
            for(var t in res.data) {
                targetText.push(res.data[t].raw);
            }
            //make a get request to the API, passing the raw text and desired language (translates the raw text using Bing Translate)
            axios.get('/api/translateText', {
                params: {
                    text:targetText,
                    toLanguage:"en"
                }
            }).then((res2) => {
                //once loaded, pair the translated text with the raw text
                for(var d in res2.data) {
                    res.data[d].translated = res2.data[d].translations[0].text;
                }
            }).catch((error) => {
                setError(true);
            })
            //update the overall app state with the translated text
            var imageCopies = [...props.userImages];
            imageCopies[props.activeImageIndex].imageText = res.data;
            props.setUserImages(imageCopies);
        }).catch((error) => {
            setError(true);
        });
    }

    //once the component has been mounted, use the canvas container reference to set the base dimensions used to calculate the canvas dimensions
    useEffect(() => {
        setActiveText(null);
        setBaseDimensions(containerRef.current.getBoundingClientRect());
    },[containerRef]);

    //onced the base dimensions have been set or changed, resize the canvas, then load and display the image in the canvas
    useEffect(() => {
        if(baseDimensions == null) {return;}
        setCanvasDimentions(calculateCanvasDimensions(props.userImages[props.activeImageIndex].imageFile.image));
    },[baseDimensions]);

    //when the user moves to a different image, refresh the canvas and translate the image if it hasn't been translated already
    useEffect(() => {
        if(baseDimensions != null) {
            setCanvasDimentions(calculateCanvasDimensions(props.userImages[props.activeImageIndex].imageFile.image));
        }
        if(props.userImages[props.activeImageIndex].imageText == null) {
            translateImage(props.userImages[props.activeImageIndex].imageFile.rawFile);
        }
        setActiveText(null);
    },[props.activeImageIndex]);

    const canvasMargin = 50;
    //caculates the actual dimensions of the canvas element given the dimensions of it's container, and an image
    const calculateCanvasDimensions = (img) => {
        const parentDimensions = baseDimensions;
        //10px margin around the image
        //get the scaled aspect ratio of the image, scaled to maintain the width of the image
        const aspectRatio = Math.min((parentDimensions.width-canvasMargin*2)/img.width,1);
        const canvasDimensions = {width:Math.max(parentDimensions.width,img.width*aspectRatio+canvasMargin*2),height:Math.max(parentDimensions.height,img.height*aspectRatio+canvasMargin*2)};
        return canvasDimensions;
    };

    const updateActiveText = (text) => {
        setActiveText(text);
    }
    //the container element for the canvas, used to help manage the dimensions of the canvas via a DOM reference
    const CanvasContainer = styled.div`
        background-color: rgb(200,200,200);
        margin-top:60px;
        height:${canvasDimensions != null ? canvasDimensions.height.toString() + "px;" : '95%;'}
        width:100%;
        display:flex;
        justify-content:center;
        align-items:center;
    `;
    //if the image is still being translated, display a loading message, otherwise display a general welcome message
    var currentText = props.userImages[props.activeImageIndex].imageText == null ? loadingText : readyText;
    currentText = activeText == null ? currentText : activeText.translated;

    const currImage = props.userImages[props.activeImageIndex].imageFile.image;
    return(
        <StyledPage>
            <Banner>
                <NavMenu>
                    {props.activeImageIndex > 0 ? 
                        <button onClick={() => {props.setActiveImageIndex(props.activeImageIndex-1)}}>
                            <i class="fa-solid fa-chevron-left"></i>
                        </button> 
                        : <i class="fa-solid fa-chevron-left"></i>
                    }
                    <h3>{props.activeImageIndex+1 + " / " + props.userImages.length}</h3>
                    {props.activeImageIndex < props.userImages.length-1 ? 
                        <button onClick={() => {props.setActiveImageIndex(props.activeImageIndex+1)}}>
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>                   
                        : <i class="fa-solid fa-chevron-right"></i>
                    }
                </NavMenu>
            </Banner>
            <CanvasContainer ref={containerRef}>
                {canvasDimensions != null ? <ImageCanvas margin={canvasMargin} image={currImage} text={props.userImages[props.activeImageIndex].imageText} clickCallback={updateActiveText} containerRef={containerRef} width={canvasDimensions.width} height={canvasDimensions.height}/> : null}
            </CanvasContainer>
            <TextBar style={APIError ? {"color":"red"} : {"color":"black"}}>
                <h4>{APIError ? "Translation services unavailable, please try again later" : currentText}</h4>
            </TextBar>
        </StyledPage>
    );
}

export default ImagePageFunction;