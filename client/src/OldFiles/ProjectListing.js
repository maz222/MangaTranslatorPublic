import React, {useState} from 'react';

import styled from 'styled-components';

import ImageListing from './ImageListing';

import EditProjectModal from './EditProjectModal';

const StyledProjectButton = styled.button`
    padding:10px;
    margin: 0px 20px 0px 0px;
    font-size: 1.25em;
    border-radius:100px;
    border:0;
    background-color: rgba(0,0,0,0);

    &:hover {
        background-color: rgb(0,0,0,.1);
        cursor:pointer;
    }
`;
const StyledDescription = styled.p`
    color:rgb(240,240,240);
    margin:0px 0px 1px 20px;
    padding: 10px 30px 10px 30px;
    background-color:#212738;
    flex-grow:1;
`;
const StyledAddImageButon = styled.button`            
    padding:10px;
    margin: 0px 20px 0px 10px;
    font-size: 1em;
    border-radius:100px;
    border:0;
    background-color: rgba(0,0,0,0);

    &:hover {
        background-color: rgb(0,0,0,.1);
        cursor:pointer;
    }
`;

class ProjectListing extends React.Component {
    //props : {updateProjects:func(), projects:[Project], projectIndex:int}
        //Project : {title:string, description:string, images:[Image], expanded:bool}
        constructor(props) {
        super(props);
        this.updateProject = this.updateProject.bind(this);
        this.state = {isEditing:false};
    }
    toggleExpanded() {
        var tempProject = {...this.props.projects[this.props.projectIndex]};
        tempProject.expanded = !tempProject.expanded;
        this.updateProject(tempProject);
    }
    removeProject() {
        var tempProjects = this.props.projects.slice();
        tempProjects.splice(this.props.projectIndex,1);
        return tempProjects;
    }
    updateProject(newProject) {
        var tempProjects = this.removeProject();
        tempProjects.splice(this.props.projectIndex,0,newProject);
        this.setState({isEditing:false});
        //this.setState({isEditing:false},() => {console.log("???"); this.props.updateProjects(tempProjects)});
        this.props.updateProjects(tempProjects);
    }
    render() {
        const project = this.props.projects[this.props.projectIndex];

        const backgroundColor = project.expanded ? "#EBCB55" : "rgb(250,250,250)";
        const hoverbackgroundColor = project.expanded ? "rgb(215,183,65)" : "rgb(230,230,230)";
        const StyledListingHeader = styled.div`
            flex-grow:1;
            margin:1px 20px 0px 20px;
            padding: 0px 30px 0px 30px;
            background-color:${backgroundColor};
            display:flex;
            justify-content:space-between;
            align-items:center;
            border:1px solid rgba(0,0,0,.2);

            &:hover {
                background-color:${hoverbackgroundColor};
                cursor:pointer;
            }
        `;
        return(
            <div style={{width:'100%'}}>
                <div style={{width: '100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <StyledListingHeader onClick={() => {this.toggleExpanded()}}>
                        <h4>{project.title}</h4>
                        {project.expanded ? <i class="fas fa-caret-up"></i> : <i class="fas fa-caret-down"></i>}
                    </StyledListingHeader>
                    {project.expanded ? <StyledProjectButton onClick={() => {this.setState({isEditing:true})}}><i class="fas fa-edit"></i></StyledProjectButton> : null}
                    {project.expanded ? <StyledProjectButton onClick={() => {this.props.updateProjects(this.removeProject())}}><i class="fas fa-trash-alt"></i></StyledProjectButton> : null}
                </div>
                <div style={{width: '100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    {project.expanded ? <StyledDescription>{project.description}</StyledDescription> : null}
                    {project.expanded ? <StyledAddImageButon><i class="fas fa-plus"></i></StyledAddImageButon> : null}
                </div>
                <div>
                    {project.expanded ? 
                    project.images.map((image, index) => {return <ImageListing project={project} imageIndex={index} updateProject={this.updateProject}/>}) : null}
                </div>

                {
                    this.state.isEditing ?               
                        <EditProjectModal projects={this.props.projects} projectIndex={this.props.projectIndex} updateProject={this.updateProject}/> : null
                }
            </div>
        );
    }
}

export default ProjectListing;