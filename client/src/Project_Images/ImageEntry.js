import styled from 'styled-components';
import React, {useEffect, useState} from 'react';

import {Link} from "react-router-dom";

const ImageCard = styled.div`
    position:relative;
    width:100%;
    height:calc(100% - 20px);
    display:flex;
    justify-content:center;
    align-items:center;
    background-color:#363946;
    border-radius:10px;
    padding:10px 0 10px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    svg {
        fill:red;
        width:30px;
        height:30px;
    }

    img {
        max-width:90%;
        max-height:90%;
        object-fit:contain;
        border-radius:5px;
    }

    :hover {
        cursor:pointer;
    }
`;

const ActiveImageCard = styled(ImageCard)`
    .deleteButton {
        position:absolute;
        top:10px;
        right:10px;
        border:0;
        background-color:rgba(0,0,0,0);

        svg {
            fill:#C64668;
            width:30px;
            height:30px;
        }

        :hover {
            cursor:pointer;
        }
    }

    .magnifyButton {
        position:absolute;
        top:calc(50% - 40px);
        right:calc(50% - 40px);
        background-color:rgba(0,0,0,0);
        border:0;

        svg {
            fill:white;
            width:80px;
            height:80px;
        }
    }

    ::before {
        content:"";
        position:absolute;
        top:0;
        left:0;
        background-color:rgba(0,0,0,.2);
        width:100%;
        height:100%;
    }
`;


function ImageItem(props) {
    const [image, setImage] = useState(null);
    const containerRef = React.useRef(null);

    useEffect(() => {
        var isCancel = false;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            setImage(e.target.result);
        }
        fileReader.readAsDataURL(props.imageFile);
        return() => {
            isCancel = true;
            if(fileReader.readyState === 1) {
                fileReader.abort();
            }
        }
    });

    return(
        props.active ? 
        (<ActiveImageCard>
            <button className="deleteButton" onClick={() => {props.deleteImage(props.index)}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z"/></svg>
            </button>
            <Link className="magnifyButton" to={"/viewImage"} state={{images:props.images,imageIndex:props.index}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg>
            </Link>
            <img src={image}/>
        </ActiveImageCard>)
        :
        (<ImageCard onClick={() => props.toggleActive(props.index)}>
            <img src={image}/>
        </ImageCard>)
    );
}

export default ImageItem;