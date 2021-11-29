//Variable mit string des Jsons (aufgrund der CORS-Policy, konnte ich das Json nicht in einem seperaten File platzieren)
var inputData =`
[
    {
        "deutsch" : "Hallo, ich heisse Devin.",
        "englisch" : "Hello my name is Devin.",
        "französisch" : "Bonjour, je m'appelle Devin."
    },
    {
        "deutsch" : "Ich esse einen Döner.",
        "englisch" : "I eat a kebab.",
        "französisch" : "Je mange un kebab."
    },
    {
        "deutsch" : "Lernen wir zusammen etwas Neues.",
        "englisch" : "Let's learn something new together.",
        "französisch" : "Apprenons quelque chose de nouveau ensemble."
    },
    {
        "deutsch" : "Lösen Sie zunächst das Problem. Dann schreiben Sie den Code.",
        "englisch" : "First, solve the problem. Then, write the code.",
        "französisch" : "D'abord, résoudre le problème. Ensuite, écrivez le code."
    },
    {
        "deutsch" : "Erfahrung ist der Name, den jeder für seine Fehler verwendet.",
        "englisch" : "Experience is the name everyone gives to their mistakes.",
        "französisch" : "L'expérience est le nom que chacun donne à ses erreurs."
    },
    {
        "deutsch" : "Wissen ist Macht.",
        "englisch" : "Knowledge is power.",
        "französisch" : "La connaissance est le pouvoir."
    },
    {
        "deutsch" : "Java ist für JavaScript, was das Auto für den Teppich ist.",
        "englisch" : "Java is to JavaScript what car is to Carpet.",
        "französisch" : "Java est à JavaScript ce que la voiture est à la moquette."
    },
    {
        "deutsch" : "Sei du selbst, alle anderen sind schon vergeben.",
        "englisch" : "Be yourself; everyone else is already taken.",
        "französisch" : "Soyez vous-même ; tous les autres sont déjà pris."
    },
    {
        "deutsch" : "Wahnsinn ist immer wieder das Gleiche zu tun, aber andere Ergebnisse zu erwarten.",
        "englisch" : "Insanity is doing the same thing, over and over again, but expecting different results.",
        "französisch" : "La folie, c'est faire la même chose, encore et encore, mais s'attendre à des résultats différents."
    },
    {
        "deutsch" : "Um unsere Sicherheit und anhaltende Stabilität zu gewährleisten, wird die Republik in das erste galaktische Imperium umgewandelt, um eine sichere und geschützte Gesellschaft zu schaffen.",
        "englisch" : "In order to ensure our security and continuing stability, the Republic will be reorganized into the first Galactic Empire, for a safe and secure society.",
        "französisch" : "Afin d'assurer notre sécurité et notre stabilité permanente, la République sera réorganisée en premier Empire Galactique, pour une société sûre et sécurisée."
    },
    {
        "deutsch" : "Wenn du willst, dass eine Sache gut gemacht wird, mach es selbst.",
        "englisch" : "If you want a thing done well, do it yourself.",
        "französisch" : "Si vous voulez qu'une chose soit bien faite, faites-la vous-même."
    },
    {
        "deutsch" : "Hallo.",
        "englisch" : "Hello.",
        "französisch" : "Bonjour"
    }
]
`;


var data; //Data-Objekt gefüllt mit den Daten der inputdata

let score = 0; //Score des Benutzers
let highscore = 0; //Highscore des Benutzers

let correctWord = ""; //Das korrekte Wort
let words; //Ein Array mit den Wörtner des aktuellen Satzes
let randomWordIndex; //Der Index des selektierten Wortes im words array

var language1 = "deutsch"; //Die Sprache in dem der Text angezeigt wird (Standart: Deutsch)

var language2 = "englisch"; //Die Sprache in dem der Lückentext angezeigt wird (Standart: Englisch)

var lives = 1; //Die Anzahl falsche Antworten die der User beim Spiel haben kann (Standart 1, Min 1, Max 10)

//Initialisiert alles, was für das Spiel wichtig ist. (Wird beim Laden der Seite aufgerufen)
function initGame() {
    //Laden der Daten
    data = JSON.parse(inputData);
    loadHighScore();
    updateHighScoreText();
}

//Ladet den Highscore aus dem Localstorage
function loadHighScore() {
    let tempHighScore = parseInt(localStorage.getItem("highscore"));
    if(tempHighScore != undefined) {
        highscore = tempHighScore;
    }
    /*
    * Falls der Highscore NaN (Not a Number) ist,
    * dann wir dieser auf 0 zurückgesetzt
    */
    if (isNaN(highscore)){
        highscore = 0;
    }
}

//Speichert den Highscore in das Localstorage
function saveHighScore() {
    localStorage.setItem("highscore", highscore);
}

//Setzt den Highscore zurück
function resetHighScore(){
    localStorage.removeItem("highscore");
    highscore = 0;
    updateHighScoreText();
}

//Updated den Highscore Text in dem Menü
function updateHighScoreText() {
    document.getElementById("menuHighScoreText").innerText = "Highscore: " + highscore;
}

//Updated den Score Text in dem Spiel
function updateGameScoreText() {
    document.getElementById("gameScoreText").innerHTML = "Score: " + score + "<br>Highscore: " + highscore;
}

//Updated den Versuche Text in dem Spiel
function updateLivesText(){
    document.getElementById("livesText").innerHTML = "Leben: " + lives;
}

//Kreiert einen Übergang von dem Hauptmenü zu dem Spiel
function transitionToGame() {
    let menuDiv = document.getElementById("menuDiv");
    let gameDiv = document.getElementById("gameDiv");
    menuDiv.style.display = "none";
    gameDiv.style.display = "block";
}

//Kreiert einen Übergang von dem Spiel zu dem Menü
function transitionToMenu() {
    let menuDiv = document.getElementById("menuDiv");
    let gameDiv = document.getElementById("gameDiv");
    let addonDiv = document.getElementById("addonDiv");
    menuDiv.style.display = "block";
    gameDiv.style.display = "none";
    addonDiv.style.display = "none";
}

function transitionToAddText(){
    let menuDiv = document.getElementById("menuDiv");
    let addonDiv = document.getElementById("addonDiv");
    menuDiv.style.display = "none";
    addonDiv.style.display = "block";
}

//Startet das Spiel
function startGame() {
    score = 0;              //Resetten des Scores
    updateLivesText();      //Lives-Text updaten
    updateGameScoreText();  //Score-Text updaten
    transitionToGame();     //Das Spielfeld anzeigen
    displayNewQuestion();   //Eine neue Frage anzeigen
    selectLives();
    updateLivesText();
}

/**
 * Generiert eine Zahl von Min bis Max
 * min: Minimale Zahl (enthalten)
 * max: Maximale Zahl (enthalten)
 * Antwort von https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
 */
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Selektiert einen zufälligen Satz, löscht ein zufälliges Wort in dem übersetzten Satz und zeigt beide an.
function displayNewQuestion() {
    let randomIndex = randomInteger(0, data.length - 1);
    let item = data[randomIndex];

    let inputfield = document.getElementById("answerInput");
    inputfield.disabled = false;
    inputfield.value = ''; //Das Value des Inputfields leeren
    inputfield.focus(); //Das Input Field fokusieren

    document.getElementById("checkButton").disabled = false;

    randomMode();

    //
    switch (language1){
        case "deutsch":
            document.getElementById("gameFirstQuestionSentence").innerText = item.deutsch; 
            break;
        case "englisch":
            document.getElementById("gameFirstQuestionSentence").innerText = item.englisch;
            break;
        case "französisch":
            document.getElementById("gameFirstQuestionSentence").innerText = item.französisch;
            break;    
    }
    
    switch (language2){
        case "deutsch":
            words = item.deutsch.split(' ');
            break;
        case "englisch":
            words = item.englisch.split(' ');
            break;
        case "französisch":
            words = item.französisch.split(' ');
            break; 
    }

    randomWordIndex =  randomInteger(0, words.length - 1);
    correctWord = words[randomWordIndex];
    words[randomWordIndex] = new Array(words[randomWordIndex].length + 1).join('_');

    document.getElementById("gameSecondQuestionSentence").innerText = words.join(' ');
}

//Parst die Antwort für die Überprüfung. Jegliche Sonderzeichen werden entfernt und alle Buchstaben der Antwort werden klein gemacht.
function parseAnswer(answer) {
    return answer.toLowerCase().replace('!', '').replace('.', '').replace(',', '').replace('"', '').replace('(', "").replace(')', '');
}

//Event für den Keypress des Benutzers in dem Inputfield. Überprüft ob der Benutzer den Enter-Key betätigt hat und überprüft in diesem Falle die Antwort.
function inputFieldKeyDown(event) {
    if(event.key == 'Enter') {
        checkAnswer();
    } 
}

//Überprüft die vom Benutzer eingebene Antwort
function checkAnswer() {
    let inputField = document.getElementById("answerInput");

    document.getElementById("checkButton").disabled = true;
    inputField.disabled = true;

    let userAnswer = inputField.value;

    let correctionPanel = document.getElementById("correctionPanel");
    let correctionPanelTitle = document.getElementById("correctionPanelTitle");
    correctionPanel.style.display = "block";
    
    words[randomWordIndex] = correctWord;

    document.getElementById("correctSentenceText").innerHTML = "Richtige Antwort:<br>" + words.join(' '); //Richtige Antwort auf den Array von Wörtern setzen

    if(parseAnswer(userAnswer) == parseAnswer(correctWord)) { //Überprüfen der Antwort
        //Texte des correction panels setzen
        correctionPanel.style.backgroundColor = "#00c41a";
        correctionPanelTitle.innerHTML = "✅ Richtig";
        document.getElementById("userAnswerText").innerHTML = "";

        //Aktion des Correction-Panels setzen
        correctionPanel.onclick = function() {
            displayNewQuestion();
            correctionPanel.style.display = "none";
        }

        //Score Handling
        score++;
        if(score > highscore) {
            highscore = score;
            correctionPanelTitle.innerHTML += "<br>Neuer Highscore: " + highscore;
            saveHighScore();
            updateLivesText();      
            updateHighScoreText();
        }
    }else {
        //Texte des correction panels setzen
        correctionPanel.style.backgroundColor = "#ed3215";
        correctionPanelTitle.innerHTML = "❌ Leider Falsch<br>Dein Score: " + score;
        words[randomWordIndex] = userAnswer;
        document.getElementById("userAnswerText").innerHTML = "Deine Antwort:<br> " + words.join(' ');

        //Aktion des Correction-Panels setzen
        correctionPanel.onclick = function() {
            correctionPanel.style.display = "none";
            //IF-ELSE Statement für kontrolle wieviel Leben der Spieler noch hat
            if(lives == 1){
            transitionToMenu();
            } else{
                lives = lives - 1;
                updateLivesText();      //Live Text updaten
                displayNewQuestion();
            }
        }
    }
    updateGameScoreText();  //Score Text updaten
}

/*
* Auswahl der Ersten Sprache (Normaltext).
* Falls die erste Sprache als z.B Deutsch ausgewählt wurde 
* kann die 2. Sprache (Lückentext) nicht Deutsch sein.
*/
function selectFirstLanguage(){
    language1 = document.getElementById("firstLanguage").value;

    //Switch Case das bestimmt welche 1. Sprache ausgewählt wurde
    switch (language1){
         
        case "deutsch":
            enableLanguage();
            document.getElementById("deutsch").disabled = true;

            /*
            * Falls die 2. Sprache das Gleiche ist wie die 1., 
            * dann wird die 2. Sprache gewchselt (von Deutsch zu Englisch)
            */
            if (document.getElementById("secondLanguage").value == "deutsch"){
                document.getElementById("secondLanguage").value = "englisch";
                language2 = document.getElementById("secondLanguage").value = "englisch";
            }
            break;

        case "englisch":
            enableLanguage();
            document.getElementById("englisch").disabled = true;

            /*
            * Falls die 2. Sprache das Gleiche ist wie die 1., 
            * dann wird die 2. Sprache gewchselt (von Englisch zu Deutsch)
            */
            if (document.getElementById("secondLanguage").value == "englisch"){
                document.getElementById("secondLanguage").value = "deutsch";
                language2 = document.getElementById("secondLanguage").value = "deutsch";
            }
            break;

        case "französisch":
            enableLanguage();
            document.getElementById("französisch").disabled = true;
    
            /*
            * Falls die 2. Sprache das Gleiche ist wie die 1., 
            * dann wird die 2. Sprache gewchselt (von Französisch zu Deutsch)
            */
            if (document.getElementById("secondLanguage").value == "französisch"){
                document.getElementById("secondLanguage").value = "deutsch";
                language2 = document.getElementById("secondLanguage").value = "deutsch";
            }
            break;          
    }
}

//Aktiviert alle Optionen bei der Select Box der 2. Sprache
function enableLanguage(){
    document.getElementById("deutsch").disabled = false;
    document.getElementById("englisch").disabled = false;
    document.getElementById("französisch").disabled = false;
}

//Auswahl der 2. Sprache (Lückentextsprache)
function selectSecondLanguage(){
    language2 = document.getElementById("secondLanguage").value;
}

//Auswahl für die Anzahl Leben (Versuche)
function selectLives(){
    lives = document.getElementById("lives").value;
}

//Zufallsmodus: Wählt die Sprachen zufälllig aus
function randomMode(){
    if(document.getElementById("random").checked == true){
        let randLanguage= ["deutsch", "englisch", "französisch"];

        let num = Math.floor(randomInteger(0,2));
        let num2;
        do{
            num2 = Math.floor(randomInteger(0,2));
        }while(num == num2)
        language1 = randLanguage[num];
        language2 = randLanguage[num2];
    }
}

//EventListener für die Select Box für die Auswahl der 1. Sprache
document.getElementById("firstLanguage").addEventListener
("change", selectFirstLanguage);

//EventListener für die Select Box für die Auswahl der 2. Sprache
document.getElementById("secondLanguage").addEventListener
("change", selectSecondLanguage);

//Eventlistener fur die Number Input für die Auswahl der Anzahl Leben
document.getElementById("lives").addEventListener
("change", selectLives);


/**EInfügen von neuen Sätzen
 * Der Benutzer kann neue Sätze hinzufügen
 * Antwort von https://stackoverflow.com/questions/18884840/adding-a-new-array-element-to-a-json-object
 */

 function addText(){
    var inputDeutsch = document.getElementById("germanInput").value;
    var inputEnglisch = document.getElementById("englishInput").value;
    var inputFranzösisch = document.getElementById("frenchInput").value;
    
    var obj = JSON.parse(inputData);
    obj.push({
        "deutsch" : inputDeutsch,
        "englisch" : inputEnglisch,
        "französisch": inputFranzösisch});
    inputData= JSON.stringify(obj);
    data = JSON.parse(inputData);
    transitionToMenu();
    }

/*
* Überprüft den Input des User
* Disabled den Button zum Speichern der Sätze, falls nichts eingeben wurde
* Um leerzeichen zu verhindern wird der Text für die Überprüfung getrimmt
*/
function checkInput(){
    ger = document.getElementById("germanInput").value;
    eng = document.getElementById("englishInput").value;
    fr =document.getElementById("frenchInput").value;
    if(ger.trim() === "" || 
    eng.trim() === "" || 
    fr.trim()=== ""){
        document.getElementById("submitButton").disabled = true;
    } else {
        document.getElementById("submitButton").disabled = false;
    }
}

/**
 * Nachdem der geschriebene Satz oder Wort in den anderen Sprachen Übersetzt wurde,
 * wird das "Speichern" Knopf freigeschaltet
 */
function unlockButton(){
    document.getElementById("submitButton").disabled = false;
}





