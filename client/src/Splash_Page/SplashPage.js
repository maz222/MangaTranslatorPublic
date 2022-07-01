import styled from 'styled-components';

import {Link} from "react-router-dom";

const Page = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color:#0F1831;
    color:rgb(240,240,240);

    h1 {
        margin: 0 0 45px 0;
    }

    p {
        margin:5px;
    }
`;

const UploadLink = styled(Link)`
    background-color:#1F3AB3;
    color:white;
    text-decoration:none;
    padding:10px 20px 10px 20px;
    font-size:1.5em;
    border-radius:20px;
    margin:50px 0 50px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    :hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
`;

const DemoLink = styled(Link)`
    color:#C48D4D;
    padding: 5px 10px 5px 10px;
    margin:0;
`

/*
    Home page of the app. Has links to the image upload page, and demo page
*/
function SplashPage(props) {
    return(
        <Page>
            <h1>Manga Translator</h1>
            <p>Automatically detect and translate any foreign text in an image to English!</p>
            <p>Upload multiple images at a time and browse them in the app.</p>
            <UploadLink to={"/projectImages"}>Upload Images</UploadLink>
            <DemoLink to={"/demoImages"}>Or try using some demo images!</DemoLink>
        </Page>
    )
}

export default SplashPage;