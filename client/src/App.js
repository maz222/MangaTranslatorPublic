import './App.css';

import {BrowserRouter, Routes, Route} from "react-router-dom";
import { useState } from 'react';
import styled from 'styled-components';

import SplashPage from './Splash_Page/SplashPage';
import ProjectImages from './Project_Images/ProjectImagesFunctional';
import ImagePageFunction from './Image_Viewer/ImagePageFunction';
import DemoImagePage from './Demo_Images/DemoImagePage';
import PasswordWrapper from './Password_Wrapper/PasswordWrapper';

const PageContainer = styled.div`
  width:100%;
  height:100%;
`;

/*
State:
  userImages: [{UserImage},...]
      -UserImage: {imageFile:{rawFile,blob,image},imageText:{(Image Text)}}
          -imageFile : the file data for the user image
              -rawFile : the raw user file
              -blob : parsed b24 data from the user file
              -image : (Image) created from the file data
          -imageText : ([{raw,translated,rect},...]) an array of objects, each representing a text detection within the image, to be overlayed over the image
              - raw : (string) the raw, untranslated text detected in the image
              - translated : (string) the translated text
              - rect : ({x,y,width,height}) the positional data for the text. x/y are top left corner. in pixels.
  activeImageIndex : (int) the index of the image the user is currently interacting with
*/
function App() {
  const [userImages,setUserImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  return (
    <BrowserRouter>
      <PageContainer id="pageContainer">
        <Routes>
          <Route path="/" element={<SplashPage/>}/>
          <Route path="/viewImage" element={<ImagePageFunction userImages={userImages} setUserImages={setUserImages} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex}/>}/>
          <Route path="/projectImages" element={<PasswordWrapper password={"gandalf"} child={<ProjectImages userImages={userImages} setUserImages={setUserImages} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex} projectTitle={"Upload Images"}/>}/>}/>
          <Route path="/demoImages" element={<PasswordWrapper password={"gandalf"} child={<DemoImagePage userImages={userImages} setUserImages={setUserImages} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex}/>}/>}/>
        </Routes>
      </PageContainer>
    </BrowserRouter>
  );
}

export default App;
