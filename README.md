# MangaTranslatorPublic
Public version of Manga Translator without API keys, etc

Uses [Google Cloud Vision API](https://cloud.google.com/vision) and [Bing Text Translation API](https://www.microsoft.com/en-us/translator/business/translator-api/) to automatically detect and translate text in images.
Users can upload any number of their own images, and browse them (with translations) in the app.
Uses React, Express, [Axios](https://axios-http.com/), [Styled Components](https://styled-components.com/), NodeJS, and an HTML5 Canvas element.

Hosted on heroku [here](https://translate-manga.herokuapp.com/) (may take a minute to load due to Free Tier inactivity).


## Cloning / running your own copy
1. Clone this project
2. Make Sure you have NodeJS and NPM [installed](https://phoenixnap.com/kb/install-node-js-npm-on-windows) on your computer
3. Create a Google Cloud account for the [Cloud Vision API](https://cloud.google.com/vision/docs/setup)
  ..* Once you have the Cloud Vision API Key JSON file, move it into the main folder the project
  ![image](https://user-images.githubusercontent.com/28494523/176967784-8012cfc6-feb1-441f-aad1-7131a2785204.png)
  ..* Update `line 7 in MangaTranslator/server/index.js` to use your new API Key
    EG: `const visionClient = new vision.ImageAnnotatorClient({keyFilename:"./myNewAPIKey.json"})`
4. Create a Microsoft Azure account and [set up](https://www.microsoft.com/en-us/translator/business/trial/#get-started) the free tier Translator plan
  ..* Once you have the API Key, update `line 155 in  MangaTranslator/server/index.js` to use your API key
    EG: `const bingApiKey = "my_api_key_goes_here";`
5. Now that the app is setup, open two windows consoles
6. Navigate one console to the base MangaTranslator folder
7. Navigate the other console to the MangaTranslator/client folder
8. Type `npm start` into both consoles and hit enter
9. After taking a second for npm to install / load everything, a tab should open in your browser with the App

**While both Google Vision and Bing Translate have free tiers / plans, there is a usage limit. Please keep this in mind when using your App.**

If you wish, you can remove the password screens from the app by editing out the React element for each Route in MangaTranslator/client/src/App.js
```javascript
<Route path="/demoImages" element={<DemoImagePage userImages={userImages} setUserImages={setUserImages} activeImageIndex={activeImageIndex} setActiveImageIndex={setActiveImageIndex}/>}/>
```
