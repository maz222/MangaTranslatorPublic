import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'
import {Link} from "react-router-dom";
import axios from 'axios';

import ImageCanvas from './ImageCanvas';

const readyText = "Click on a text box to see the translation!";
const loadingText = "Translating...";

const StyledPage = styled.div`
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color:#0F1831;
`;

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

//props
    //images
    //imageIndex
//state
    //text : [Text]
        //Text : {translated:"",raw:"",rect:{x,y,width,height}}
function ImagePageFunction(props) {
    const location = useLocation();
    const containerRef = useRef();

    const [image, setImage] = useState(null);
    const [text, setText] = useState(null);
    const [activeText, setActiveText] = useState(null);
    const [APIError, setError] = useState(false);
    const [canvasDimensions, setCanvasDimentions] = useState(null)

    const loadFile = (file) => {
        setError(false);
        var isCancel = false;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            var img = new Image;
            img.onload = () => {
                //console.log("image loaded");
                setCanvasDimentions(calculateCanvasDimensions(img));
                setImage(img);
                translateImage(file);
            }
            img.src = fileReader.result;
            //translate image here!!!
        }
        fileReader.readAsDataURL(file);
        return() => {
            isCancel = true;
            if(fileReader.readyState === 1) {
                fileReader.abort();
            }
        }
    }
    const translateImage = (image) => {
        //console.log("translating?");
        //console.log(image);
        const API_URL = "/api/detectText";
        const form = new FormData();
        form.append('file',image);
        //form.append('language','en');
        axios.post(API_URL,form,{headers: {"Content-Type":"multipart/form-data"}}).then((res) => {
            console.log(res);
            var targetText = [];
            for(var t in res.data) {
                targetText.push(res.data[t].raw);
            }
            axios.get('/api/translateText', {
                params: {
                    text:targetText,
                    toLanguage:"en"
                }
            }).then((res2) => {
                for(var d in res2.data) {
                    res.data[d].translated = res2.data[d].translations[0].text;
                }
            }).catch((error) => {
                console.log(error);
                setError(true);
            })
            setText(res.data);
            //console.log(res.data);
        }).catch((error) => {
            console.log(error);
            setError(true);
        });
    }
    useEffect(() => {
        setActiveText(null);
        setText(null);
        loadFile(location.state.images[location.state.imageIndex]);
    },[containerRef]);
    useEffect(() => {
        if(containerRef != null) {
            setActiveText(null);
            setText(null);
            loadFile(location.state.images[location.state.imageIndex]);
        }
    },[location])

    const calculateCanvasDimensions = (img) => {
        const parentDimensions = containerRef.current.getBoundingClientRect();
        const margin = 10;
        const aspectRatio = Math.min((parentDimensions.width-margin)/img.width,1);
        const canvasDimensions = {width:Math.max(parentDimensions.width,img.width*aspectRatio+margin*2),height:Math.max(parentDimensions.height,img.height*aspectRatio+margin*2)};
        return canvasDimensions;
    };

    const updateActiveText = (text) => {
        setActiveText(text);
    }

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