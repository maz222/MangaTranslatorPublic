import styled from 'styled-components';
import axios from 'axios';
import { useEffect } from 'react';
import ProjectImages from '../Project_Images/ProjectImagesFunctional';

//Simple blank, blue page for when the images are loading in
const LoadingPage = styled.div`
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    background-color:#0F1831;

    h1 {
        color:white;
    }
`;

/*
    Sample Project Images page that loads a provided set of images for demo purposes
    
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
*/
function DemoImagePage(props) {
    //loads the sample images from the server, and updates the project state (userImages, etc) accordingly
    const fetchImages = () => {
        const fileNames = ["Cover.jpg","IMG_189.jpg","IMG_190.jpg","IMG_191.jpg","IMG_192.jpg","IMG_193.jpg",
        "IMG_194.jpg","IMG_195.jpg","IMG_196.jpg","IMG_197.jpg","IMG_198.jpg","IMG_199.jpg","IMG_200.jpg",
        "IMG_201.jpg","IMG_202.jpg","IMG_203.jpg"];
        var APIPromises = [];
        var filePromises = [];
        //request raw data from server
        for(var i in fileNames) {
            APIPromises.push(axios.get("/API/demoFile", {params:{fileName:fileNames[i]},responseType:"blob"}));
        }
        //loads and parses each image, and updates the project state with a list of successfully loaded images
        Promise.allSettled(APIPromises).then((files) => {
            //console.log(files);
            for(var i in files) {
                if(files[i].status === 'fulfilled') {
                    filePromises.push(wrapFileReader(files[i].value.data));
                }
            }
            Promise.allSettled(filePromises).then((results) => {
                //console.log(results);
                var imageArr = [];
                for(var i=0; i<results.length; i++) {
                    if(results[i].status === "fulfilled") {
                        imageArr.push({imageFile:results[i].value,imageText:null});
                    }
                }
                //console.log(imageArr);
                props.setUserImages(imageArr);
            });
        });
    }
    //utility function that takes a File object, and parses it into Blob data, an Image, and the raw file
    //return a Promise that resolves to the parsed data
    var wrapFileReader = (file) => {
        const fr = new FileReader();
        return new Promise((resolve,reject) => {
            fr.onerror = () => {
                reject("error reading file");
            }
            fr.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    resolve({blob:e.target.result,image:img,rawFile:file});
                }
                img.onerror = () => {
                    reject("error loading image");
                }
                img.src = e.target.result;
            }
            fr.readAsDataURL(file)
        })
    }
    //load images at mount, and update the project state for the new images
    useEffect(() => {
        if(props.userImages.length > 0) {return;}
        fetchImages();
    },[])
    //basic blank "loading" page for when the files are still being processed
    const Loading = (
        <LoadingPage>
            <h1>Loading...</h1>
        </LoadingPage>
    );
    //if finished loading, display the image list, otherwise display a loading screen
    return(
        <div style={{width:"100%",height:"100%"}}>
            {props.userImages.length > 0 ? <ProjectImages userImages={props.userImages} setUserImages={props.setUserImages} activeImageIndex={props.activeImageIndex} setActiveImageIndex={props.setActiveImageIndex} projectTitle={"Demo Images"} /> : Loading}
        </div>
    );
}

export default DemoImagePage;