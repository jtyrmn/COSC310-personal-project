const axios = require('axios').default;
const querystring = require('querystring');
const question_identifiers = ['what', 'who', 'explain', 'tell me'];
const universals = ['is', 'are', 'a', 'the', 'about', 'of'];

//use this function to determine if the user is asking a parse-able "what ___ ?" question
function is_question(statement){
    statement = statement.toLowerCase().split(' ');

    //statement includes at least one question_identifiers
    return statement.some(word => question_identifiers.includes(word));
}

//assuming is_question(statement) returns true, attempt to extract the subject of the sentence
function parse_subject(statement){
    statement = statement.toLowerCase().split(' ');
    
    //continuously remove the left words of the statement until we get to verbs/nouns
    while(statement.length > 0 && (question_identifiers.includes(statement[0]) || universals.includes(statement[0]))){
        statement.shift();
    }

    //reconstruct the string
    return statement.join(' ').replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
}

//recieve a description of something from wikipedia
async function fetch_snippet(subject){
    query_str = 'https://www.wikipedia.org/w/api.php?' + querystring.encode({action: 'query', list: 'search', srsearch: subject, srprop: 'snippet', format: 'json', srlimit: 1});
    //const data = await axios.get(query_str);
    // .then(response => {
    //     let snippet = response.data.query.search;
    //     //if wikipedia successfully returned results from the subject string
    //     if(snippet && snippet[0]){
    //         return_value = snippet[0].snippet.replace(/<\/?[^>]+(>|$)/g, '');;
    //     }
    // })
    // .catch(error => {
    //     console.log('ruh-roh!:', error);
    // })

    const response = await axios.get(query_str).then(response => response.data.query.search);

    if(response && response[0]){
        const snippet = response[0].snippet.replace(/<\/?[^>]+(>|$)/g, '');
        return snippet;
    }else{
        return undefined;
    }
}

fetch_snippet('black hole').then(response => console.log(response))