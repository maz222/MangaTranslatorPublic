import './App.css';

import {BrowserRouter, Routes, Route} from "react-router-dom";
import styled from 'styled-components';

import SplashPage from './Splash_Page/SplashPage';
import ProjectImages from './Project_Images/ProjectImages';
import ImagePageFunction from './Image_Viewer/ImagePageFunction';
import DemoImagePage from './Demo_Images/DemoImagePage';
import PasswordWrapper from './Password_Wrapper/PasswordWrapper';

const PageContainer = styled.div`
  width:100%;
  height:100%;
`;

function App() {
  return (
    <BrowserRouter>
      <PageContainer id="pageContainer">
        <Routes>
          <Route path="/" element={<SplashPage/>}/>
          <Route path="/viewImage" element={<ImagePageFunction/>}/>
          <Route path="/projectImages" element={<PasswordWrapper password={"gandalf"} child={<ProjectImages images={[]} projectTitle={"Upload Images"}/>}/>}/>
          <Route path="/demoImages" element={<PasswordWrapper password={"gandalf"} child={<DemoImagePage/>}/>}/>
        </Routes>
      </PageContainer>
    </BrowserRouter>
  );
}

export default App;
