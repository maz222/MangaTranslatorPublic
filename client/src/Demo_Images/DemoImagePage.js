import styled from 'styled-components';
import {useState} from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import ProjectImages from '../Project_Images/ProjectImages';


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

function DemoImagePage(props) {
    const [loaded,setLoaded] = useState(false);
    const [demoImages,setDemoImages] = useState([]);
    //get array of Blob objects for the demo images
    const fetchImages = () => {
        //console.log("fetching");
        const fileNames = ["Cover.jpg","IMG_189.jpg","IMG_190.jpg","IMG_191.jpg","IMG_192.jpg","IMG_193.jpg",
        "IMG_194.jpg","IMG_195.jpg","IMG_196.jpg","IMG_197.jpg","IMG_198.jpg","IMG_199.jpg","IMG_200.jpg",
        "IMG_201.jpg","IMG_202.jpg","IMG_203.jpg"];
        var filePromises = [];
        var outImages = [];
        //request data from server
        for(var i in fileNames) {
            filePromises.push(axios.get("/API/demoFile", {params:{fileName:fileNames[i]},responseType:"blob"}));
        }
        //return successful files once all promises have finished
        Promise.allSettled(filePromises).then((files) => {
            for(var i in files) {
                if(files[i].status == 'fulfilled') {
                    outImages.push(files[i].value.data);
                }
            }
            setDemoImages(outImages);
            setLoaded(true);
        });
    }
    //load images at mount
    useEffect(() => {
        if(loaded) {return;}
        fetchImages();
    },[])
    const Loading = (
        <LoadingPage>
            <h1>Loading...</h1>
        </LoadingPage>
    );
    //if finished loading, display the image list, otherwise display a loading screen
    return(
        <div style={{width:"100%",height:"100%"}}>
            {loaded ? <ProjectImages images={demoImages} projectTitle={"Demo Images"} /> : Loading}
        </div>
    );
}

export default DemoImagePage;