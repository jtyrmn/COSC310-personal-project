const express = require('express');
const getResponse = require('./getResponse');
const wikipedia = require('./wikipedia');
const translate = require('./translate');
const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.use('/', express.static('site'));

server.post('/api/', async (req, res) => {
    let input = req.body.input;

    //first off: translation
    if(!translate.is_english(input)){
        input = await translate(input);
        console.log('translated output... ', input)
    }

    const output = getResponse(input);
    
    if(Array.isArray(output) && output[0] == 'ASYNC'){
        //if we need to do async stuff
        
        //wikipedia API feature
        if(output[1] == 'WIKIPEDIA'){
            wikipedia.fetch_snippet(wikipedia.parse_subject(input))
            .then(response => {
                res.json({output: response});
            });
        }
    }else{
        //otherwise proceed as normal
        res.json({output: output});
    }

});

server.get('/api/idea', (req, res) => {
    const idea = getResponse.getIdea();
    res.json({idea: idea});
});

server.post('/api/sentiment', (req, res) => {
    const input = req.body.input;
    console.log('input: ', input);
    const sentiment = getResponse.analyzeSentiment(input);
    console.log('sentiment: ', sentiment);
    res.json({sentiment: sentiment});
});

server.post('/api/stem', (req, res) => {
    const input = req.body.input;
    console.log('input: ', input);
    const stemmed = getResponse.stemInput(input);
    console.log('stemmed: ', stemmed);
    res.json({stemmed: stemmed});
});

server.post('/api/pos', (req, res) => {
    const input = req.body.input;
    console.log('input: ', input);
    const pos = getResponse.posTagger(input);
    console.log('pos: ', pos);
    res.json(pos);
});

server.listen(4000, () => {
    console.log('server running...');
});