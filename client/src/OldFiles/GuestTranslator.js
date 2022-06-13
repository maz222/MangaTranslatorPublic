import React, {useState} from 'react';

import styled from 'styled-components';

function GuestTranslator() {

    const StyledPage = styled.div`
        width:100%;
        height:100%;
        background-color: rgb(240,240,240);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    `;

    return(
        <StyledPage>
            <div>
            </div>
            <div>
            </div>
        </StyledPage>
    )
}

export default GuestTranslator;