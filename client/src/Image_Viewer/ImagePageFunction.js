import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'
import {Link} from "react-router-dom";
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
    The over page element for viewing translated images.
    Contains a navigation bar, the canvas element (with image and text boxes), and a bottom bar for displaying the translated text

    Props:
        (None, uses location to pass data instead)

    Location State: 
        images : [(Image),...] array of user images
        imageIndex : (int) the index of the image currently being displayed

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
    const location = useLocation();
    const containerRef = useRef();

    const [image, setImage] = useState(null);
    const [text, setText] = useState(null);
    const [activeText, setActiveText] = useState(null);
    const [APIError, setError] = useState(false);
    const [canvasDimensions, setCanvasDimentions] = useState(null)
    const [baseDimensions, setBaseDimensions] = useState(null);

    //loads a single image using fileReader
    const loadFile = (file) => {
        setError(false);
        var isCancel = false;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            var img = new Image;
            //once the image has finished loading
            img.onload = () => {
                //resize the canvas to fit the image and container dimensions
                setCanvasDimentions(calculateCanvasDimensions(img));
                setImage(img);
                //translate the actual image text
                translateImage(file);
            }
            img.src = fileReader.result;
        }
        fileReader.readAsDataURL(file);
        return() => {
            isCancel = true;
            if(fileReader.readyState === 1) {
                fileReader.abort();
            }
        }
    }
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
                console.log(error);
                setError(true);
            })
            setText(res.data);
        }).catch((error) => {
            console.log(error);
            setError(true);
        });
    }
    //once the component has been mounted, use the canvas container reference to set the base dimensions used to calculate the canvas dimensions
    useEffect(() => {
        setActiveText(null);
        setText(null);
        setBaseDimensions(containerRef.current.getBoundingClientRect());
    },[containerRef]);
    //onced the base dimensions have been set or changed, resize the canvas, then load and display the image in the canvas
    useEffect(() => {
        console.log(location.state.imageIndex);
        if(baseDimensions != null) {
            loadFile(location.state.images[location.state.imageIndex]);
        }
    },[baseDimensions]);
    //if the location data changes (when user navigates to a new image), load and display the new image / adjust canvas
    useEffect(() => {
        if(containerRef != null) {
            setActiveText(null);
            setText(null);
            if(baseDimensions != null) {
                loadFile(location.state.images[location.state.imageIndex]);
            }
        }
    },[location])
    //caculates the actual dimensions of the canvas element given the dimensions of it's container, and an image
    const calculateCanvasDimensions = (img) => {
        const parentDimensions = baseDimensions;
        //10px margin around the image
        const margin = 10;
        //get the scaled aspect ratio of the image, scaled to maintain the width of the image
        const aspectRatio = Math.min((parentDimensions.width-margin)/img.width,1);
        const canvasDimensions = {width:Math.max(parentDimensions.width,img.width*aspectRatio+margin*2),height:Math.max(parentDimensions.height,img.height*aspectRatio+margin*2)};
        return canvasDimensions;
    };

    const updateActiveText = (text) => {
        setActiveText(text);
    }
    //the container element for the canvas, used to help manage the dimensions of the canvas via a DOM reference
    const tempCanvasDimensions = canvasDimensions != null ? canvasDimensions : {width:null,height:null};
    const CanvasContainer = styled.div`
        background-color: rgb(200,200,200);
        margin-top:40px;
        height:${tempCanvasDimensions.height != null ? tempCanvasDimensions.height.toString() + "px;" : '95%;'}
        width:100%;
        display:flex;
        justify-content:center;
        align-items:center;
    `;
    //if the image is still being translate, display a loading message, otherwise display a general welcome message
    var currentText = loadingText;
    if(text != null) {
        currentText = readyText;
        if(activeText != null) {
            currentText = activeText.translated;
        }
    }
    return(
        <StyledPage>
            <Banner>
                <NavMenu>
                    {location.state.imageIndex > 0 ? 
                        <Link className="magnifyButton" to={"/viewImage"} state={{images:location.state.images,imageIndex:location.state.imageIndex-1}} style={{color:"white"}}>
                            <i class="fa-solid fa-chevron-left"></i>
                        </Link> 
                        : <i class="fa-solid fa-chevron-left"></i>
                    }
                    <h3>{location.state.imageIndex+1 + " / " + location.state.images.length}</h3>
                    {location.state.imageIndex < location.state.images.length-1 ? 
                        <Link className="magnifyButton" to={"/viewImage"} state={{images:location.state.images,imageIndex:location.state.imageIndex+1}} style={{color:"white"}}>
                            <i class="fa-solid fa-chevron-right"></i>
                        </Link>                   
                        : <i class="fa-solid fa-chevron-right"></i>
                    }
                </NavMenu>
            </Banner>
            <CanvasContainer ref={containerRef}>
                {image != null ? <ImageCanvas image={image} text={text} clickCallback={updateActiveText} containerRef={containerRef} width={canvasDimensions.width} height={canvasDimensions.height}/> : null}
            </CanvasContainer>
            <TextBar style={APIError ? {"color":"red"} : {"color":"black"}}>
                <h4>{APIError ? "Translation services unavailable, please try again later" : currentText}</h4>
            </TextBar>
        </StyledPage>
    );
}

export default ImagePageFunction;