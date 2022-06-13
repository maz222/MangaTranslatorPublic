import React, {useState} from 'react';

import styled from 'styled-components';

class ImageListing extends React.Component {
    //props : {project, imageIndex, updateProject()}
    constructor(props) {
        super(props);
    }
    removeImage() {
        var tempProject = {...this.props.project};
        tempProject.images.splice(this.props.imageIndex,1);
        this.props.updateProject(tempProject);
    }
    render() {
        const StyledImageListing = styled.div`
            width:calc(100% - 100px);
            margin:1px 20px 1px 20px;
            padding: 0px 30px 0px 30px;
            background-color:rgb(240,240,240);
            display:flex;
            justify-content:space-between;
            align-items:center;

            &:hover {
                background-color:rgb(220,220,220);
                cursor:pointer;
            }
        `;

        const StyledTrashButton = styled.button`
            font-size: 1em;
            border-radius:100px;
            border:0;
            padding:10px;
            background-color:rgba(0,0,0,0);

            &:hover {
                background-color:rgba(0,0,0,.1);
                cursor:pointer;
            }
        `;

        const image = this.props.project.images[this.props.imageIndex];

        return(
            <StyledImageListing>
                <p>{image.title}</p>
                <StyledTrashButton onClick={() => {this.removeImage()}}><i class="fas fa-trash-alt"></i></StyledTrashButton>
            </StyledImageListing>
        )
    }
}

export default ImageListing;