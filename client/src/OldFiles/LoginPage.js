import { render } from '@testing-library/react';
import axios from 'axios';
import React from 'react';

import {Navigate} from 'react-router-dom';

import styled from 'styled-components';

const StyledLoginPage = styled.div`
    width:100%;
    height:100%;
    background-color: rgb(240,240,240);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
`;

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userName:"User Name",userPassword:"Password",loggedIn:false};
        this.verifyLogin = this.verifyLogin.bind(this);
    }
    verifyLogin() {
        this.setState({loggedIn:true})
    }
    testAPI() {
        //fetch("/api/translateText?text=someText&language=en").then((res) => res.json()).then((data)=>{console.log(data)});
        const url = "https://api.cognitive.microsofttranslator.com/languages";
        axios.get(url, {
            params: {
                'api-version':'3.0',
                'scope':"translation"
            }
        }).then((res) => {
            console.log(res);
        });
    }
    render() {
        return(
            <StyledLoginPage>
                <h1>Image Translator</h1>
                <input type="text" value={this.state.userName} onChange={(e) => {this.setState({userName:e.target.value})}}/>
                <input type="text" value={this.state.userPassword} onChange = {(e) => {this.setState({userPassword:e.target.value})}}/>
                <button onClick={this.verifyLogin}>Log In</button>
                <button onClick={this.testAPI}>Test API</button>
                <p>Don't have an account? Try using as a <a href="">guest</a> or <a href="/createAccount">create an account</a>.</p>
                {this.state.loggedIn ? <Navigate to="/projectImages"/> : null}
            </StyledLoginPage>
        )
    }
}

export default LoginPage;