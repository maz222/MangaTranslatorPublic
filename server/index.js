const express = require("express");
const path = require('path');
const vision =  require("@google-cloud/vision");
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

const visionClient = new vision.ImageAnnotatorClient({keyFilename:"./someVisionKey.json"})

const PORT = process.env.PORT || 3001;
const app = express();
const multer = require('multer');
const os = require('os');
const upload = multer({dest:os.tmpdir()});

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

/*
    Formats the data returned from the google cloud vision API
    https://cloud.google.com/vision/docs/fulltext-annotations

    'A fullTextAnnotation is a structured hierarchical response for the UTF-8 text extracted from the image, organized as Pages→Blocks→Paragraphs→Words→Symbols:'
    -combines words (per paragraph) into a single, space separated string
    -formates the bounding boxes to be {x,y,width,height} 
    -returns an array of Objects:
        [{
            rect:{x,y,width,height} - bounding box (x,y being top left corner)
            language:(string) - the detected language
            raw:(string) - the actual detected text
            translated:(string) - an empty string that will eventually store the translated text
        },...]
*/
function parseData(rawData) {
    var parsedData = [];
    const textData = rawData[0].fullTextAnnotation;
    //parse pages
    for(var pageIndex in textData.pages) {
        const page = textData.pages[pageIndex];
        //parse blocks
        for(var blockIndex in page.blocks) {
            const block = page.blocks[blockIndex];
            //for each paragraph, combine the words and format bounding box
            for(var paragraphIndex in block.paragraphs) {
                const paragraph = block.paragraphs[paragraphIndex];
                /*
                    Formats the original bounding box info from 
                    [{x,y},{x,y},{x,y},{x,y}] to {x,y,width,height} - (x,y being the top left corner)
                */
                const vertices = parseVertices(paragraph.boundingBox.vertices);
                const language = block.property == null ? null : block.property.detectedLanguages;
                //combine each word into a single string, separated by spaces 
                var text = "";
                for(var wordIndex in paragraph.words) {
                    const word = paragraph.words[wordIndex];
                    for(var charIndex in word.symbols) {
                        text += word.symbols[charIndex].text;
                    }
                    if(wordIndex != paragraph.words.length -1) {
                        text += " ";
                    }
                }
                //add the formatted text object to the overall list
                var paragraphData = {rect:vertices,language:language,raw:text,translated:""};
                parsedData.push(paragraphData);
            }
        }
    }
    return parsedData
}


/*
    Formats the original bounding box info from 
    [{x,y},{x,y},{x,y},{x,y}] to {x,y,width,height} - (x,y being the top left corner)
*/
function parseVertices(vertices) {
    //get list of all the x and y values for each corner of the bounding box
    var xVals = [];
    var yVals = [];
    for(var v in vertices) {
        xVals.push(vertices[v].x);
        yVals.push(vertices[v].y);
    }
    const xMin = Math.min(...xVals);
    const xMax = Math.max(...xVals);
    const yMin = Math.min(...yVals);
    const yMax = Math.max(...yVals);
    //get leftmost (x), topmost (y) points for the top left corner, the width of the box, and the hight of the box
    return({x:xMin,y:yMin,width:xMax-xMin,height:yMax-yMin});
}

/*
    API Endpoint
        Temporarily uploads a single file to the server for text detection.
        Uses Google Cloud Vision API

    Input: 
        file : (File) user image to be translated
    Output:
        array of formatted text detections
            [{
                rect:{x,y,width,height} - bounding box (x,y being top left corner)
                language:(string) - the detected language
                raw:(string) - the actual detected text
                translated:(string) - an empty string that will eventually store the translated text
            },...]
*/
app.post("/api/detectText/", upload.single('file'), (req, res) => {
    visionClient.documentTextDetection(req.file.path).then((results) => {
        res.json(parseData(results));
    }).catch((error) => {
        res.status(403).send();
        return null;
    });
})

/*
    API Endpoint
        Sends one of the provided demo images

    Input:
        fileName : (string) the name of the desired file
    Output:
        One of the demo images, if there is an appropriately named image
*/
app.get("/api/demoFile/", (req,res) => {
    const fileName = __dirname + "/Demo_Images/" + req.query.fileName;
    res.sendFile(fileName, (err) => {
        res.status(403).send();
    })
});

/*
    API Endpoint
        Uses images detections from /api/detectText and Bing Translate API to translate raw text into english

    Input
        array of raw text detections
            [{
                rect:{x,y,width,height} - bounding box (x,y being top left corner)
                language:(string) - the detected language
                raw:(string) - the actual detected text
                translated:(string) - an empty string that will eventually store the translated text
            },...]
    Output
        array of translated text detections
        (same as input, but with the 'translated' fields populated by the translated text)
*/
app.get("/api/translateText/", (req,res) => {
    const textData = req.query.text;
    const toLanguage = req.query.toLanguage;
    const bingApiKey = "some API key";
    var endpoint = "https://api.cognitive.microsofttranslator.com";

    var textArr = [];
    for(var t in textData) {
        textArr.push({'text':textData[t]});
    }

    axios({
        baseURL:endpoint,
        url:"/translate",
        method:'post',
        headers: {
            'Ocp-Apim-Subscription-Key': bingApiKey,
            'Ocp-Apim-Subscription-Region': "westus2",
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'to': [toLanguage]
        },
        data: textArr,
        responseType:'json'
    }).then((res2) => {
        res.json(res2.data);
    }).catch((error) => {
        res.status(error.response.status).send();
    })
})

app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname,'../client/build', 'index.html'));
})