const bing_translate = require('bing-translate-api');
const languagedetect = new (require('languagedetect'));

//this function *attempts* to determine if the statement is already english so 
// the program doesnt need to waste time and API calls translating a statement that is already english
function is_english(statement){
    try{
        return languagedetect.detect(statement, 1)[0][0] == 'english';
    }catch(err){
        //just assume some wierd gibberish was inputted
        return false;
    }
}

//uses bing translate API to translate statement
async function translate(statement){
    return await bing_translate.translate(statement, null, 'en', true).then(res => res.translation);
}

module.exports = translate;
module.exports.is_english = is_english;
