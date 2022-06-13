import styled from 'styled-components';

import {Link} from "react-router-dom";
import axios from 'axios';

import mangaImage from './Mangas.png';

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

function SplashPage(props) {
    const handleDemo = () => {
        const fileNames = ["Cover.jpg","IMG_189.jpg","IMG_190.jpg","IMG_191.jpg","IMG_192.jpg","IMG_193.jpg",
        "IMG_194.jpg","IMG_195.jpg","IMG_196.jpg","IMG_197.jpg","IMG_198.jpg","IMG_199.jpg","IMG_200.jpg",
        "IMG_201.jpg","IMG_202.jpg","IMG_203.jpg"];
        var loadCount = fileNames.length;
        var files = [];
        for(var i in fileNames) {
            //console.log(fileNames[i]);
            axios.get("/API/demoFile",{params:{fileName:fileNames[i]},responseType:"blob"}).then((res) => {
                //console.log(res);
                //console.log(typeof res.data);
                const fileReader = new FileReader();
                fileReader.fileName = fileNames[i];
                //console.log(fileNames[i]);
                //console.log(fileReader.fileName);
                fileReader.onload = (e) => {
                    //console.log(e.target.fileName);
                    loadCount -= 1;
                    files.push([fileNames[i],e.target.result]);
                    if(loadCount == 0) {
                        files.sort((a,b) => (a[0] > b[0]) ? 1 : -1);
                        //console.log(files);
                    }
                }
                fileReader.onerror = (e) => {
                    console.log(e);
                    loadCount -= 1;
                    if(loadCount == 0) {
                        files.sort((a,b) => (a[0] > b[0]) ? 1 : -1);
                        //console.log(files);
                    }
                }
                fileReader.readAsDataURL(res.data);
            });
        }
    };
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