import React from 'react';
import styled from 'styled-components';

import {Link} from 'react-router-dom';

import ImageCanvas from './ImageCanvas';
import ImageTextBox from './TextBox';
import ImageUpload from './ImageUploadForm';
import axios from 'axios';

const StyledPage = styled.div`
    width:100%;
    height:100%;
    background-color: rgb(200,200,200);
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const StyledBanner = styled.div`
    padding:10px 20px 10px 20px;
    width:calc(100% - 40px);
    background-color:#6184D8;
    display:flex;
    align-items:center;
    justify-content:space-between;
    color:white;
    height:calc(5% - 20px);
`;

const TranslatingBanner = styled.h3`
    padding:10px;
    width:calc(100% - 20px);
    background-color:#E36B52;
    margin:0;
    text-align:center;
`

const FlexContainer = styled.div`
    width:100%;
    display:flex;
    align-items:center;
`;


const SelectLanguageLabel = styled.label`
    margin-right:10px;
`;

function SelectLanguage(props) {
    return(
        <div>
            <SelectLanguageLabel>{props.labelText}</SelectLanguageLabel>
            <select onChange={(e) => {props.callback(e.target.value);}}>
                {
                    props.languages.map((language,index) => {
                        return(<option value={index} selected={index==props.currentValue}>{language.name}</option>);
                    })
                }
            </select>
        </div>
    );
}

var translateToOptions = [
    "English",
    "Japanese",
    "Korean",
    "Chinese"
]

class ImageViewer extends React.Component {
    //props
        //imageURL : image URL
        //text : [Text]
            //Text : {translated:"",raw:"",rect:{x,y,width,height}}
        //title : string
        //description : string
    constructor(props) {
        super(props);
        this.state = {image:null, text:props.text, language:null, languageOptions:[], activeText:null, canvasDimensions:null, translating:false};
        this.updateToLanguage = this.updateToLanguage.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.updateText = this.updateText.bind(this);
        this.updateActiveText = this.updateActiveText.bind(this);
        this.translateImage = this.translateImage.bind(this);
        this.fetchLanguages();
    }
    fetchLanguages() {
        const url = "https://api.cognitive.microsofttranslator.com/languages";
        axios.get(url, {
            params: {
                'api-version':'3.0',
                'scope':"translation"
            }
        }).then((res) => {
            console.log(res);
            const languageRaw = res.data.translation;
            var languages = [];
            for(var l in languageRaw) {
                languages.push({key:l,name:languageRaw[l].name});
            }
            languages.sort((l1,l2) => (l1.name > l2.name) ? 1 : -1);
            console.log(languages);
            var englishIndex;
            for(var l in languages) {
                if(languages[l].name == "English") {
                    englishIndex = l;
                }
            }
            this.setState({languageOptions:languages, language:englishIndex});
        });
    }
    updateToLanguage(language) {
        console.log(language);
        this.setState({language:language});
    }
    updateImage(newImage) {
        //var testText = [
        //    {translated:"this is a test", raw:"ajsdcgajgdfjas", rect:{x:0,y:0,width:200,height:400}},
        //    {translated:"this is more text", raw:"dfjkasdhf", rect:{x:300,y:300,width:100,height:100}}
        //];
        this.setState({image:newImage, text:[]}, () => {this.setState({canvasDimensions:this.calculateCanvasDimensions()})});
    }
    updateText(newText) {
        this.setState({text:newText});
    }
    updateActiveText(newActiveText) {
        this.setState({activeText:newActiveText});
    }
    calculateCanvasDimensions() {
        const parentDimensions = document.getElementById("canvasContainer").getBoundingClientRect();
        //console.log(parentDimensions);
        //console.log(this.state.image);
        const margin = 10;
        const image = this.state.image;
        const aspectRatio = Math.min((parentDimensions.width-margin)/image.width,1);
        const canvasDimensions = {width:Math.max(parentDimensions.width,image.width*aspectRatio+margin*2),height:Math.max(parentDimensions.height,image.height*aspectRatio+margin*2)};
        return canvasDimensions;
    }
    translateImage() {
        if(this.state.image != null) {
            //console.log("translating?");
            //console.log(this.state.image);
            this.setState({translating:true});
            var apiURL = "/api/translateImage";
            axios.get(apiURL, {
                params: {
                    image:this.state.image.src
                }
            }).then((res) => {
                console.log(res);
                var targetText = [];
                for(var t in res.data) {
                    targetText.push(res.data[t].raw);
                }
                console.log(targetText);
                axios.get('/api/translateText', {
                    params: {
                        text:targetText,
                        toLanguage:this.state.languageOptions[this.state.language].key
                    }
                }).then((res2) => {
                    console.log("---");
                    for(var d in res2.data) {
                        res.data[d].translated = res2.data[d].translations[0].text;
                        //console.log(res2.data[d].translations[0].text);
                    }
                }).catch((error) => {
                    console.log(error);
                    this.setState({translating:false});
                    alert("Translation services unavailable, please try again later");
                })
                this.updateText(res.data);
                this.setState({translating:false});
            }).catch((error) => {
                console.log(error);
                this.setState({translating:false});
                alert("Translation services unavailable, please try again later");
            });
        }
    }
    render() {
        const canvasDimensions = this.state.canvasDimensions != null ? this.state.canvasDimensions : {width:null,height:null};
        const CanvasContainer = styled.div`
            background-color: rgb(200,200,200);
            height:${canvasDimensions.height != null ? canvasDimensions.height.toString() + "px;" : '95%;'}
            width:100%;
            display:flex;
            justify-content:center;
            align-items:center;
        `;

        return(
            <StyledPage>
                <StyledBanner>
                    <h3>{this.props.title}</h3>
                    <SelectLanguage labelText={"Translate To:"} languages={this.state.languageOptions} currentValue={this.state.language} callback={this.updateToLanguage} />
                    <button onClick={() => {this.setState({image:null,text:[]})}} disabled={this.state.translating}>New Picture</button>
                    <button onClick={this.translateImage} disabled={this.state.translating}>Translate</button>
                </StyledBanner>
                {this.state.translating ? <TranslatingBanner>Translating...</TranslatingBanner> : null}
                <CanvasContainer id="canvasContainer">
                    {this.state.image == null ? <ImageUpload updateImage={this.updateImage}/> : <ImageCanvas image={this.state.image} text={this.state.text} clickCallback={this.updateActiveText} 
                        width={canvasDimensions.width} height={canvasDimensions.height}/>}
                </CanvasContainer>
                {
                    this.state.image != null ? 
                       this.state.activeText != null ? 
                           <ImageTextBox rawText={this.state.activeText.raw} translatedText={this.state.activeText.translated} /> :
                       <ImageTextBox rawText={null} translatedText={null} />
                    : null
                }
            </StyledPage>
        );
    }
}
//                    {this.state.image == null ? <ImageUpload updateImage={this.updateImage}/> : <ImageCanvas image={this.state.image} text={this.state.text} />}

export default ImageViewer