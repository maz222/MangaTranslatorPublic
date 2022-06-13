import styled from 'styled-components';

import { useState } from 'react';

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

function PasswordWrapper(props) {
    const [password,setPassword] = useState("");
    const [success,setSuccess] = useState(false);
    const checkPassword = (e) => {
        e.preventDefault();
        if(password == props.password) {
            setSuccess(true);
        }
        else {
            alert("Please enter the correct password!");
            setPassword("");
        }
    }
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