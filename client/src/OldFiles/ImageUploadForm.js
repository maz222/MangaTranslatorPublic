import React from 'react';
import styled from 'styled-components';

const ImageForm = styled.div`;
    display:flex;
    flex-direction:column;
    justify-content:center;
    background-color:rgb(240,240,240);
    border:1px solid rgba(0,0,0,.25);
    border-radius:10px;
    width:60%;

    #banner {
        padding:20px;
        margin:0;
        background-color:white;
        border-radius: 10px 10px 0 0;
        text-align:center;
        border-bottom:1px solid rgba(0,0,0,.3);
    }

    h4 {
        margin:10px 0 10px 0;
    }

    p {
        margin:0;
    }

    #imageListContainer {
        background-color:rgba(200,200,200);
        padding: 15px;
    }

    #addContainer {
        padding:15px;
    }

    .inputContainer {
        width:100%;
        margin-bottom:10px;
        
        p {
            font-weight:bold;
        }

        input {
            width:calc(100% - 10px);
            padding:5px;
            margin-top:5px;
            font-size:.75em; 
        }
    }

    #submitContainer {
        display:flex;
        justify-content:space-around;
        padding:20px;
        background-color:white;
        border-radius: 0 0 10px 10px;
 
    }

    .mainButton {
        border-radius:5px;
        border:0;
        width:30%;
        color:white;
    }

    #addButton {
        background-color:green;
        padding:10px;
        font-size:1em;
    }

    #submitButton {
        background-color:blue;
        padding:10px;
        font-size:1em;
    }

    .imageListing {
        display:flex;
        justify-content: space-between;
        align-items:center;
        font-size:.75em
    }
`;

class ImageItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="imageListing">
                <p>{this.props.name}</p>
                <button onClick={() => {this.props.deleteCallback(this.props.index)}}><i class="fa-solid fa-delete-left"></i></button>
            </div>
        )
    }
}

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {URL:"",imageName:"",language:"",images:[]}
        this.handleURL = this.handleURL.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }
    handleURL(e) {
        this.setState({URL:e.target.value});
    }
    handleName(e) {
        this.setState({imageName:e.target.value});
    }
    handleAdd(e) {
        var tempImages = [...this.state.images];
        var imageName = this.state.imageName != "" ? this.state.imageName : "Image " + (this.state.images.length+1);
        tempImages.push({url:this.state.URL, name:imageName, language:this.state.language});
        this.setState({images:tempImages,URL:"",imageName:""});
    }
    handleSubmit(e) {
        var fileImage = new Image();
        if(this.state.URL != null) {
            fileImage.src=this.state.URL;
        }
        fileImage.onload = () => {this.props.updateImage(fileImage)}
    }
    deleteImage(imageIndex) {
        console.log(imageIndex);
        var tempImages = [...this.state.images]
        tempImages.splice(imageIndex,1);
        this.setState({images:tempImages});
    }
    render() {
        var fileName = this.state.file;
        if(fileName != null) {
            fileName = fileName.split("\\");
            fileName = fileName[fileName.length - 1];
        }
        var addButtonEnabled = (this.state.URL != null && this.state.URL.length > 0) || this.state.file != null;
        var submitButtonEnabled = this.state.images.length > 0;
        submitButtonEnabled = true;

        return(
            <ImageForm>
                <h3 id="banner">Upload Images</h3>
                <div id="imageListContainer">
                    <h4>Images</h4>
                    {this.state.images.map((listing,index) => {
                        return <ImageItem name={listing.name} deleteCallback={this.deleteImage} index={index}></ImageItem>
                    })}
                </div>
                <div id="addContainer">
                    <div className="inputContainer">
                        <p>Image Name</p>
                        <input type="text" value={this.state.imageName == "" ? "Image " + (this.state.images.length+1) : this.state.imageName} onChange={this.handleName}/>
                    </div>
                    <div className="inputContainer">
                        <p>From URL</p>
                        <input type="text" value={this.state.URL == "" ? "Image URL" : this.state.URL} onChange={this.handleURL}/>
                    </div>
                </div>
                <div id="submitContainer">
                    <button className="mainButton" id="addButton" disabled={!addButtonEnabled} onClick={this.handleAdd}>Add Image</button>
                    <button className="mainButton" id="submitButton" disabled={!submitButtonEnabled} onClick={this.handleSubmit}>Submit</button>
                </div>
            </ImageForm>

        );
    }
}

export default ImageUpload;