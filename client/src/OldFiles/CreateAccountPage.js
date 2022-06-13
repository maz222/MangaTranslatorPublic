import React from 'react';

//import {Navigate} from 'react-router-dom';

import styled from 'styled-components';

const StyledPage = styled.div`
    width:100%;
    height:100%;
    background-color: rgb(240,240,240);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
`;

class CreateAccountPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userName:"User Name",userPassword1:"Password",userPassword2:"Repeat Password",accountCreated:false};
        this.verifyAccount = this.verifyAccount.bind(this);
    }
    verifyAccount() {
        this.setState({accountCreated:true});
    }
    render() {
        return(
            this.state.accountCreated ? 
            <StyledPage>
                <h1>Create Account</h1>
                <p>Account created! Let's <a href="">get started</a>!</p>
            </StyledPage> 
            : 
            <StyledPage>
                <h1>Create Account</h1>
                <input type="text" value={this.state.userName} onChange={(e) => {this.setState({userName:e.target.value})}}/>
                <input type="text" value={this.state.userPassword1} onChange = {(e) => {this.setState({userPassword1:e.target.value})}}/>
                <input type="text" value={this.state.userPassword2} onChange = {(e) => {this.setState({userPassword2:e.target.value})}}/>
                <button onClick={this.verifyAccount}>Create Account</button>
            </StyledPage>
        )
    }
}

export default CreateAccountPage;