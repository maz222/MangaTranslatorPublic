import styled from 'styled-components';
import React from 'react';

import ImageEntry from './ImageEntry';
import ImageItem from './ImageEntry';
import PageBar from './PageBar';

const colCount = 10;
const rowCount = 5;

const Page = styled.div`
    width:100%;
    height:100%;
    background-color: #0F1831;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

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

const ImageGrid = styled.div`
    margin:20px;
    width:calc(100% - 40px);
    height:calc(100% - 100px - 80px - 40px);
    display:grid;
    grid-template-columns: repeat(${colCount}, minmax(0,1fr));
    grid-template-rows : repeat(${rowCount}, minmax(0,1fr));
    gap:10px;
`;

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
const imagesPerPage = colCount * rowCount;

class ProjectImages extends React.Component {
    constructor(props) {
        super(props);
        //console.log(props.images);
        this.state = {images:props.images, currentPage:0, activeImageIndex:null};

        this.setActiveImageIndex = this.setActiveImageIndex.bind(this);
        this.setActivePageIndex = this.setActivePageIndex.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }
    addImage(e) {
        var tempImages = [...this.state.images];
        //console.log(e.target.value);
        //console.log(e.target.files);
        //console.log("Adding " + e.target.files.length + " new files");
        for(var i=0; i<e.target.files.length; i++) {
            tempImages.push(e.target.files[i]);
        }
        //tempImages.push(e.target.value);
        //console.log(tempImages);
        this.setState({images:tempImages, currentPage:Math.floor((tempImages.length+1)/imagesPerPage)});
    }
    deleteImage(index) {
        //console.log("deleteing image at index " + index);
        //console.log(this.state.images);
        var tempImages = [...this.state.images];
        tempImages.splice(index,1);
        var newActiveIndex = index == this.state.activeImageIndex ? null : this.setActiveImageIndex;
        this.setState({images:tempImages, activeImageIndex:newActiveIndex});
    }
    setActiveImageIndex(index) {
        //console.log("setting active image to " + index);
        this.setState({activeImageIndex:index});
    }
    setActivePageIndex(index) {
        //console.log("setting page to " + index);
        index = Math.min(Math.max(0,index),Math.floor(this.state.images.length/imagesPerPage));
        this.setState({currentPage:index});
    }
    resetImages() {
        if(this.state.images.length == 0) {
            return;
        }
        if(window.confirm("Delete all images?")) {
            this.setState({images:[],currentPage:0,activeImageIndex:null});
        }
    }
    render() {
        const startImageIndex = this.state.currentPage * imagesPerPage;
        const endImageIndex = Math.min(this.state.images.length-1,startImageIndex+imagesPerPage-2);
        var imageIndices = [];
        for(var i=startImageIndex; i<=endImageIndex; i++) {
            imageIndices.push(i);
        }        
        //console.log([startImageIndex,endImageIndex]);
        //console.log(imageIndices);
        //console.log("---");
        return(
            <Page>
                <Banner>
                    <h3 className="projectName">{this.props.projectTitle}</h3>
                    <button className="deleteButton" onClick={() => {this.resetImages()}}>
                        <i class="fa-solid fa-circle-xmark"></i>
                    </button>
                </Banner>
                <ImageGrid>
                    <AddImageCard>
                        <input type="file" multiple id="uploadImageButton" accept="image/png, image/jpeg" onChange={(e) => this.addImage(e)}></input>
                        <label htmlFor="uploadImageButton">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 368C269.3 368 280 357.3 280 344V280H344C357.3 280 368 269.3 368 256C368 242.7 357.3 232 344 232H280V168C280 154.7 269.3 144 256 144C242.7 144 232 154.7 232 168V232H168C154.7 232 144 242.7 144 256C144 269.3 154.7 280 168 280H232V344C232 357.3 242.7 368 256 368z"/></svg>   
                        </label>
                    </AddImageCard>
                    {imageIndices.map((val,index) => {
                        const actualIndex = index + startImageIndex;
                        //console.log(this.state.images[val])
                        return(
                            <ImageItem images={this.state.images} imageFile={this.state.images[val]} active={this.state.activeImageIndex == actualIndex} index={actualIndex} deleteImage={this.deleteImage} toggleActive={this.setActiveImageIndex} openImage={this.openImage}/>
                        );
                        //return(<h1>{actualIndex}</h1>);
                    })}
                </ImageGrid>
                <PageBar currentPageIndex={this.state.currentPage} totalNumPages={Math.floor(this.state.images.length/imagesPerPage)}
                    pagesPerGroup={10} setPage={this.setActivePageIndex}></PageBar>
            </Page>
        );
    }
}

export default ProjectImages;