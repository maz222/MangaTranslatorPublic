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

class CreateProjectModal extends React.Component {
    //props
        //projects - [Project]
        //updateProjects - func()
    constructor(props) {
        super(props);
        this.state = {title:"New Project", description:"A new project"};
    }
    addProject() {
        var newProject = {title:this.state.title, description:this.state.description, images:[]};
        var newProjects = this.props.projects.slice();
        newProjects.push(newProject);
        this.props.updateProjects(newProjects);
    }
    render() {
        return(
            <ModalBackground>
                <Modal>
                    <h3>New Project</h3>
                    <FlexContainer>
                        <h4>Title:</h4>
                        <TextInput type="text" value={this.state.title} onChange={(e) => {this.setState({title:e.target.value})}}/>
                    </FlexContainer>
                    <FlexContainer>
                        <h4>Descripton:</h4>
                        <TextInput type="text" value={this.state.description} onChange={(e) => {this.setState({description:e.target.value})}}/>
                    </FlexContainer>
                    <FlexContainer>
                        <CancelButton type="button" onClick={(e) => {this.props.updateProjects(this.props.projects.slice())}}>Cancel</CancelButton>
                        <SubmitButton type="buton" onClick={(e) => {this.addProject()}}>Submit</SubmitButton>
                    </FlexContainer>
                </Modal>
            </ModalBackground>
        );
    }
}

export default CreateProjectModal;