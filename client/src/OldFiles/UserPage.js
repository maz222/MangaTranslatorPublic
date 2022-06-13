import React, {useState} from 'react';

import styled from 'styled-components';

import ProjectListing from './ProjectListing';
import CreateProjectModal from './CreateProjectModal';

const StyledPage = styled.div`
    width:100%;
    height:100%;
    background-color: rgb(200,200,200);
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const StyledBanner = styled.div`
    padding:10px 10px 10px 20px;
    width:calc(100% - 30px);
    background-color:#6184D8;
    display:flex;
    align-items:center;
    justify-content:space-between;
    color:white;
`;

const StyledBannerButtons = styled.div`
    padding:5px 20px 5px;
    display:flex;
`;

const StyledBannerButton = styled.button`
    padding:10px;
    margin: 0px 10px  0px 10px;
    font-size: 1.5em;
    border-radius:100px;
    border:0;
    background-color: rgb(220,220,220);

    &:hover {
        background-color:rgb(180,180,180);
        cursor:pointer;
    }
`;

const StyledSectionHeader = styled.div`
    width:calc(100% - 40px);
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:0px;
    margin:20px;
`;

const StyledAddProjectButton = styled.button`            
    padding:10px;
    margin: 0px 20px 0px 0px;
    font-size: 2em;
    border-radius:100px;
    border:0;
    background-color: rgba(0,0,0,0);

    &:hover {
        background-color: rgb(0,0,0,.1);
        cursor:pointer;
    }
`;

class UserPage extends React.Component {
    //props - projects : [Project]
        //Project : {title, description, [Images]}
            //Image : {title, description}
    constructor(props) {
        super(props);
        this.state = {projects:props.projects, isCreatingProject:false}
        this.updateProjects = this.updateProjects.bind(this);
    }
    updateProjects(newProjects) {
        this.setState({projects:newProjects, isCreatingProject:false});
    }
    render() {
        return(
            <StyledPage>
                <StyledBanner>
                    <h3>Image Translator</h3>
                    <StyledBannerButtons>
                        <StyledBannerButton>
                            <i class="fas fa-save"></i>
                        </StyledBannerButton>
                        <StyledBannerButton>
                            <i class="fas fa-user"></i>
                        </StyledBannerButton>
                    </StyledBannerButtons>
                </StyledBanner>
                <StyledSectionHeader>
                    <h1 style={{margin:0,padding:0}}>Projects</h1>
                    <StyledAddProjectButton onClick={() => {this.setState({isCreatingProject:true})}}><i class="fas fa-plus"></i></StyledAddProjectButton>
                </StyledSectionHeader>
                {this.state.projects.map((project, index) => {
                    return(<ProjectListing projects={this.state.projects} updateProjects={this.updateProjects} projectIndex={index} expanded={false}/>)   
                })}
                {this.state.isCreatingProject ? <CreateProjectModal projects={this.state.projects} updateProjects={this.updateProjects}/> : null}
            </StyledPage>
        );
    }
}

export default UserPage;