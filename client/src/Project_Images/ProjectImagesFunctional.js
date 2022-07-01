import styled from 'styled-components';
import {useState} from 'react';

import ImageItem from './ImageEntry';
import PageBar from './PageBar';

//basic, empty background page
const Page = styled.div`
    width:100%;
    height:100%;
    background-color: #0F1831;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

//top banner
const Banner = styled.div`
    width:calc(100% - 40px);
    height:100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0 20px 0 20px;
  
    h3 {
        color: white;
        background-color:#03050A;
        padding:10px 30px 10px 30px;
        margin:10px;
        border-radius:10px;
        border:1px solid black;
        box-sizing:border-box;
    }

    button {
        font-size:1.5em;
        padding:15px;
        margin:10px;        
        border-radius:10px;
        display:flex;
        justify-content:center;
        align-items:center;
        background-color:#C64668;
        color:white;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        border:0;

        &:hover {
            cursor:pointer;
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        }
    }
`;
//used to determine how many rows and columns are used in the image thumbnail grid. key corresponds to the minimum screen width
const screenMap = {0:{col:3,row:4},768:{col:4,row:5},1200:{col:10,row:5}};
//grid of thumbnails for user images
const ImageGrid = styled.div`
    margin:20px;
    width:calc(100% - 40px);
    height:calc(100% - 100px - 80px - 40px);
    display:grid;

    @media only screen and (min-width: 0px) {
        grid-template-columns: repeat(${screenMap[0].col}, minmax(0,1fr));
        grid-template-rows : repeat(${screenMap[0].row}, minmax(0,1fr));
    }
    @media only screen and (min-width: 768px) {
        grid-template-columns: repeat(${screenMap[768].col}, minmax(0,1fr));
        grid-template-rows : repeat(${screenMap[768].row}, minmax(0,1fr));
    }
    @media only screen and (min-width: 1200px) {
        grid-template-columns: repeat(${screenMap[1200].col}, minmax(0,1fr));
        grid-template-rows : repeat(${screenMap[1200].row}, minmax(0,1fr));
    }
    gap:10px;
`;
//Card / button for uploading a new user image
const AddImageCard = styled.div`
    width:100%;
    height:100%;
    background-color:rgb(240,240,240);
    border: 2px solid black;
    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    input {
        display:none;
    }
    label {
        display:flex;
        justify-content:center;
        align-items:center;

        &:hover {
            cursor:pointer;
        }
    }
    svg {
        width:25%;
        height:25%;
        fill:rgb(20,20,20);
    }

    &:hover {
        cursor:pointer;
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
`;
//calculate how many images are displayed on a page, based on the dimensions of the grid / screen resolution
var imagesPerPage = 0;
const screenMapKeys = Object.keys(screenMap);
for(var i in screenMapKeys) {
    const index = screenMapKeys.length-1-i
    if(window.screen.width >= screenMapKeys[index]) {
        imagesPerPage = screenMap[screenMapKeys[index]].col * screenMap[screenMapKeys[index]].row;
        break;
    }
}

/*
    Project images page where user can upload, browse, and delete images
    Dislays a grid of image thumbnails, each of which can be clicked on and then either opened or deleted

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
        projectTitle: (string) the title to be displayed in the top banner
    State:
        currentPage: (int) the current page number being viewed (EG: page 2 out of 5, with 10 images per page, 50 images total)
*/
function ProjectImages(props) {
    const [currentPage, setCurrentPage] = useState(0);

    /*
        Utility function for processesing an uploaded image
        Takes a File object, and returns a Promise
        Promise resolves to an object containing the Blob data, an Image object, and the raw uploaded file (the input)
    */
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

    /*
        Called when user uplods an image (or images) to the app
        Input : e - the file upload input element
        Uses the wrapper function to process and add each uploaded image to the overall list, and updates the current grid page number if necessary
    */
    var addImage = (e) => {
        var imagePromises = [];
        for(var i=0; i<e.target.files.length; i++) {
            imagePromises.push(wrapFileReader(e.target.files[i]));
        }
        Promise.allSettled(imagePromises).then((results) => {
            var imageArr = [...props.userImages];
            //create a list of successfully processed images
            for(var i=0; i<results.length; i++) {
                if(results[i].status === "fulfilled") {
                    imageArr.push({imageFile:results[i].value,imageText:null});
                }
            }
            //update the overall list of images
            props.setUserImages(imageArr);
            //update the current page 
            setCurrentPage(Math.floor((imageArr.length+1)/imagesPerPage));    
        })
    }

    //deletes a image from the overall list, given the index of that image
    var deleteImage = (index) => {
        //create a copy of the image list and remove the desired image
        var tempImages = [...props.userImages];
        tempImages.splice(index,1);
        //if the image being deleted is the current active image, change the active image index to the previous image (always true)
        var newActiveIndex = index === props.activeImageIndex ? 
            null : 
            index > props.activeImageIndex ? props.activeImageIndex : props.activeImageIndex - 1;
        //update image list and active index
        props.setUserImages(tempImages);
        props.setActiveImageIndex(newActiveIndex);
    }

    //updates the current page the user is viewing
    var setPage = (index) => {
        //can't navigate to a negative page or past the total number of pages
        index = Math.min(Math.max(0,index),Math.floor(props.userImages.length/imagesPerPage));
        setCurrentPage(index);
    }

    //deletes all the uploaded images after a confirmation prompt
    var resetImages = () => {
        if(props.userImages.length === 0) {
            return;
        }
        if(window.confirm("Delete all images?")) {
            props.setUserImages([]);
            setPage(0);
            props.setActiveImageIndex(null);
        }
    }

    //creates a list of the indices of each currently viewed image (EG: [0,1,2,3,4,5,...])
    const startImageIndex = currentPage * imagesPerPage;
    //leaves one grid slot for the 'add image' card
    const endImageIndex = Math.min(props.userImages.length-1,startImageIndex+imagesPerPage-2);
    var imageIndices = [];
    for(var i=startImageIndex; i<=endImageIndex; i++) {
        imageIndices.push(i);
    }

    return(
        <Page>
        <Banner>
            <h3 className="projectName">{props.projectTitle}</h3>
            <button className="deleteButton" onClick={() => {resetImages()}}>
                <i class="fa-solid fa-circle-xmark"></i>
            </button>
        </Banner>
        <ImageGrid>
            <AddImageCard>
                <input type="file" multiple id="uploadImageButton" accept="image/png, image/jpeg" onChange={(e) => addImage(e)}></input>
                <label htmlFor="uploadImageButton">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 368C269.3 368 280 357.3 280 344V280H344C357.3 280 368 269.3 368 256C368 242.7 357.3 232 344 232H280V168C280 154.7 269.3 144 256 144C242.7 144 232 154.7 232 168V232H168C154.7 232 144 242.7 144 256C144 269.3 154.7 280 168 280H232V344C232 357.3 242.7 368 256 368z"/></svg>   
                </label>
            </AddImageCard>
            {imageIndices.map((val,index) => {
                const actualIndex = index + startImageIndex;
                return(
                    <ImageItem imageFile={props.userImages[val].imageFile.blob} active={props.activeImageIndex === actualIndex} index={actualIndex} deleteImage={deleteImage} toggleActive={props.setActiveImageIndex}/>
                );
            })}
        </ImageGrid>
        <PageBar currentPageIndex={currentPage} totalNumPages={Math.floor(props.userImages.length/imagesPerPage)}
            pagesPerGroup={10} setPage={setPage}></PageBar>
    </Page>
    );
}

export default ProjectImages;