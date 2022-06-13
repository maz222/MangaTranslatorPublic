import styled from 'styled-components';

const TextBox = styled.div`
    position:fixed;
    top:82%;
    margin:10px;
    padding:10px;
    overflow:auto;
    width:calc(90% - 40px);
    height:calc(18% - 40px);
    background-color: white;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;

    h4 {
        margin:0;
    }
    p {
        margin:0;
    }
`;

function TranslatedText(props) {
    return(
        <div style={{width:'100%'}}>
            <h4>Translated Text:</h4>
            <p>{props.translatedText}</p>
            <hr />
            <h4>Raw Text:</h4>
            <p>{props.rawText}</p>
        </div>
    )
}

function ImageTextBox(props) {
    return(
        <TextBox>
            {
                props.translatedText == null || props.rawText == null ? 
                    <h4>Click one of the text boxes in the image to see the translated text!</h4> : <TranslatedText translatedText={props.translatedText} rawText={props.rawText}/>
            }
        </TextBox>
    );
}

export default ImageTextBox;