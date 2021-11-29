
//Überprüft welches Feld als letztes bearbeitet wurde
function lastedit(lastfield){
    sourceLanguage = lastfield;
}

/**
 * Übersetzt den Text und überweist die Daten in die anderen Inputfelder
 */
function translate(){

    switch(sourceLanguage){
        case "de":
            text = document.getElementById("germanInput").value;
            break;
        case "en":
            text = document.getElementById("englishInput").value;
            break;
        case "fr":
            text = document.getElementById("frenchInput").value;
            break;     
    }

    if(sourceLanguage != "de"){
        download(text, sourceLanguage, "de", document.getElementById("germanInput"));
    }
    if(sourceLanguage != "en"){
        download(text, sourceLanguage, "en", document.getElementById("englishInput"));
    }
    if(sourceLanguage !="fr"){
        download(text, sourceLanguage, "fr", document.getElementById("frenchInput"));
    }
}


/**
 * Die Methode die den Satzt/ Wort übersetz mithilfe einer API von libretranslate (free to use)
 * @param {*} text der Text das übersetzt wird
 * @param {*} sourceLanguage in welcher Ursprungsprache der Text ist
 * @param {*} targetLanguage in welche Sprache der Text übersetzt werden soll
 * @param {*} targetInput wo der Übersetzte Text ausgegeben werden soll
 */
function download(text, sourceLanguage, targetLanguage, targetInput) {
    console.log(text + " " + sourceLanguage + " " + targetLanguage)
    fetch("https://libretranslate.de/translate", {
        method: "POST",
        body: JSON.stringify({
            q: text,
            source: sourceLanguage,
            target: targetLanguage
        }),
        headers: { "Content-Type": "application/json" }
    }).then(response => response.json())
    .then(json => targetInput.value = json["translatedText"]);
}