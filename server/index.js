const express = require("express");
const path = require('path');
const vision =  require("@google-cloud/vision");
const download = require("image-downloader");
const fs = require('fs');
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

const URL = require('url');
const { parse } = require("path");

const visionClient = new vision.ImageAnnotatorClient({keyFilename:"./visionAPIKey.json"})

const PORT = process.env.PORT || 3001;
const app = express();
const multer = require('multer');
const os = require('os');
const upload = multer({dest:os.tmpdir()});

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

function parseData(rawData) {
    //console.log(rawData);
    var parsedData = [];
    const textData = rawData[0].fullTextAnnotation;
    //console.log(rawData);
    //console.log("???");
    //console.log(textData);
    //parse pages
    for(var pageIndex in textData.pages) {
        const page = textData.pages[pageIndex];
        //console.log(page);
        //parse blocks
        for(var blockIndex in page.blocks) {
            const block = page.blocks[blockIndex];
            //console.log(block);
            //console.log("---");
            //parse paragraphs
            for(var paragraphIndex in block.paragraphs) {
                const paragraph = block.paragraphs[paragraphIndex];
                //[{x,y},{x,y},{x,y},{x,y}]
                const vertices = parseVertices(paragraph.boundingBox.vertices);
                const language = block.property == null ? null : block.property.detectedLanguages;
                var text = "";
                for(var wordIndex in paragraph.words) {
                    const word = paragraph.words[wordIndex];
                    //console.log(word);
                    for(var charIndex in word.symbols) {
                        text += word.symbols[charIndex].text;
                    }
                    if(wordIndex != paragraph.words.length -1) {
                        text += " ";
                    }
                }
                //console.log(text);
                var paragraphData = {rect:vertices,language:language,raw:text,translated:""};
                parsedData.push(paragraphData);
            }
        }
    }
    return parsedData
}

function parseVertices(vertices) {
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
    return({x:xMin,y:yMin,width:xMax-xMin,height:yMax-yMin});
}

app.post("/api/detectText/", upload.single('file'), (req, res) => {
    //console.log(req.body.image);
    //console.log(req.file);
    //console.log(req.body.language);
    //console.log("---");
        
    visionClient.documentTextDetection(req.file.path).then((results) => {
        console.log(results);
        res.json(parseData(results));
    }).catch((error) => {
        console.log(error);
        res.status(403).send();
        return null;
    });
})

app.get("/api/demoFile/", (req,res) => {
    const fileName = __dirname + "/Demo_Images/" + req.query.fileName;
    console.log(fileName);
    res.sendFile(fileName, (err) => {
        res.status(403).send();
    })
});

app.get("/api/translateImage/", (req,res) => {
    //const URL = "https://cdn.lifehack.org/wp-content/uploads/2014/10/best-entrepreneur-books.jpeg";
    const imgURL = req.query.image;
    //console.log("testtin?");
    var fileExtension = imgURL.split(".");
    const tempDestination = "../../server/tempPhoto." + fileExtension[fileExtension.length-1];
    //console.log(tempDestination);
    download.image({url:imgURL,dest:tempDestination}).then(({filename})=> {
        visionClient.documentTextDetection(filename).then((results) => {
        //visionClient.batchAnnotateImages(request).then((results) => {
            console.log(results);
            console.log(results[0].responses);
            fs.unlinkSync(filename);
            res.json(parseData(results))
        });
    }).catch((error) => {
        //console.log("doh");
        console.log(error);
        res.status(403).send();
        return null;
    })
});

app.get("/api/translateText/", (req,res) => {
    //console.log(req);
    const textData = req.query.text;
    const toLanguage = req.query.toLanguage;
    const bingApiKey = "some test key"
    var endpoint = "https://api.cognitive.microsofttranslator.com";

    console.log(textData);
    console.log(toLanguage);

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
        //console.log(res2);
        res.json(res2.data);
    }).catch((error) => {
        //console.log(error);
        console.log(error.response.status);
        res.status(error.response.status).send();
    })
})

app.get('*', (req,res) => {
    res.sendFile(path.resolvel(__dirname,'../client/build', 'index.html'));
})