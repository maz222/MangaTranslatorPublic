import styled from 'styled-components';

import { useState } from 'react';
import { useEffect } from 'react';

//Simple blank, blue page for displaying the input
const Page = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color:#0F1831;
    color:white;

    h4 {
        font-size:2em;
    }

    input {
        padding:10px;
        font-size:1.25em;
    }
`;
/*
    Simple Element that renders a password input field.
    Upon entering the correct password, renders the specified component instead.

    Props:
        password : (string) the desired password the user must enter
        child : (React Component) the component to be rendered once the right password is entered

    State:
        password : (string) the user input
        success : (bool) whether the user has entered the correct password or not
*/
function PasswordWrapper(props) {
    const [password,setPassword] = useState("");
    const [success,setSuccess] = useState(false);
    const checkPassword = (e) => {
        e.preventDefault();
        if(password === props.password) {
            sessionStorage.setItem('loggedIn',true);
            setSuccess(true);
        }
        else {
            alert("Please enter the correct password!");
            setPassword("");
        }
    }
    //on mount, check if the user has already logged in this session, and skip this page if they have
    useEffect(() => {
        if(sessionStorage.getItem('loggedIn')) {
            setSuccess(true);
        }
    },[]);
    return(
            success ? 
                props.child 
                : 
                <Page>
                    <form onSubmit={checkPassword}>
                        <h4>Password</h4>
                        <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                    </form>
                </Page>
    );
}

export default PasswordWrapper