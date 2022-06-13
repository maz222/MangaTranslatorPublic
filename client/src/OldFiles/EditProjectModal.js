import React from 'react';

import styled from 'styled-components';

const ModalBackground = styled.div`
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.5);
    display:flex;
    justify-content:center;
    align-items:center;
`;
const Modal = styled.div`
    padding: 20px;
    background-color:rgb(200,200,200);
`;

const FlexContainer = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
`;

const SubmitButton = styled.button`
    padding:10px;
    border:1px solid rgba(0,0,0,.25);
    border-radius:10px;

    &:hover {
        background-color:#6184D8;
        cursor: pointer;
    }
`;

const CancelButton = styled.button`
    padding:10px;
    border:1px solid rgba(0,0,0,.25);
    border-radius:10px;

    &:hover {
        background-color:#F97068;
        cursor: pointer;
    }
`;

const TextInput = styled.input`
    padding:5px;
    margin:10px;
`;

class EditProjectModal extends React.Component {
    constructor(props) {
        super(props);
        const project = this.props.projects[this.props.projectIndex];
        this.state = {title:project.title, description:project.description};
    }
    submitEdit() {
        var project = {...this.props.projects[this.props.projectIndex]};
        project.title = this.state.title;
        project.description = this.state.description;
        this.props.updateProject(project);
    }
    render() {
        return(
            <ModalBackground>
                <Modal>
                    <h3>Edit Project</h3>
                    <FlexContainer>
                        <h4>Title:</h4>
                        <TextInput type="text" value={this.state.title} onChange={(e) => {this.setState({title:e.target.value})}}/>
                    </FlexContainer>
                    <FlexContainer>
                        <h4>Descripton:</h4>
                        <TextInput type="text" value={this.state.description} onChange={(e) => {this.setState({description:e.target.value})}}/>
                    </FlexContainer>
                    <FlexContainer>
                        <CancelButton type="button" onClick={(e) => {this.props.updateProject(this.props.projects[this.props.projectIndex])}}>Cancel</CancelButton>
                        <SubmitButton type="buton" onClick={(e) => {this.submitEdit()}}>Submit</SubmitButton>
                    </FlexContainer>
                </Modal>
            </ModalBackground>
        );
    }
}

export default EditProjectModal;