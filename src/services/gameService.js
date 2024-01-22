import { GameData } from './gameData';

// scope vars
let __currentSolution = '';
let __powerUps = [];
let __puzzleWords = [];
let __solutionArray = [];

// consts
const words = require('../scriptAssets/words.json');
const maxWords = GameData.maxWords; // inherit?
const userData = GameData.userDataStore;

// need to get a max number of words for each puzzle
// need to pick the correct answer and store it
// Timer?
// progression? xp? score? increasing difficulty system?
// should I bother using a key system to encrypt solutions and words or do we care if people want to cheat?

export function createBoard(maxLetters) {
    __puzzleWords = [];
    // get all available words for the puzzle
    const list = [...words[maxLetters.toString()]];

    // pick a random word to be our solution
    const solutionIndex = randomNum(0, list.length);
    __currentSolution = list[solutionIndex];

    // remove the solution from the list so it's not selected again
    list.splice(solutionIndex, 1);

    // pre-split the array for testing later and assign to scoped var
    __solutionArray = stringSplit(__currentSolution);

    // generate a random index insertion point for the solution into the randomized "dummy words" array
    const randomSolutionIndex = randomNum(1, maxWords);

    // generate an array of "dummy words" for hints
    let puzzleWords = createOtherWords((maxWords - 1), list, __currentSolution);
    // store filler words for the dud removal script to use later
    __puzzleWords = [...puzzleWords];

    // insert our solution into the "dummy words" array
    puzzleWords.splice(randomSolutionIndex, 0, __currentSolution);

    const lines = generateJunk(puzzleWords, {});

    // return our lines array
    return lines;
}

export function evalPowerUp(puString) {
    const powerUpUsed = __powerUps.find(pu => pu.puString === puString);
    if (powerUpUsed) {
        const powerUpUsedIndex = __powerUps.indexOf(powerUpUsed);
        __powerUps.splice(powerUpUsedIndex, 1);
        return { puType: powerUpUsed.puType, message: GameData.powerUpsData[powerUpUsed.puType].actionText };
    } else {
        console.error(`Could not find powerUps match for ${puString} in ${JSON.stringify(__powerUps)}`);
        return { puType: 10, message: 'Something went wrong' };
    }
}

export function evalWord(word1) {
    let matches = 0;

    const word1Ray = stringSplit(word1);

    for (let i = 0; i < word1Ray.length; i++) {
        if (word1Ray[i] === __solutionArray[i]) matches++;
    }

    return { match: (matches === __solutionArray.length), totalMatches: matches };
}

export function getDud(triedWords) {
    let thisDud = undefined;
    while (thisDud === undefined) {
        let randomWordIndex = randomNum(0, __puzzleWords.length);
        let randomWord = __puzzleWords[randomWordIndex];
        if (triedWords.indexOf(randomWord) < 0) thisDud = randomWord;
    }
    return thisDud;
}

function createOtherWords(numWords, list, __currentSolution) {
    let returnWords = [];
    // let requiredMatches = 4;

    // function addWordToList(word, i) {
    //     // push to return value
    //     returnWords.push(word);
    //     // remove word from original list to avoid duplicates
    //     list.splice(i, 1);
    // }

    for (let i = 0; i < numWords; i++) {
        const randomIndex = randomNum(1, list.length);
        const word = list[randomIndex];
        // addWordToList(word, randomIndex);

        returnWords.push(word);
        // remove word from original list to avoid duplicates
        list.splice(randomIndex, 1);

        // @TODO: This is intended to guarantee other words have at least one match
        // if (requiredMatches > 0) {
        //     const matchCheck = evalWord(word);
        //     if (matchCheck.totalMatches > 0) {
        //         addWordToList(word, randomIndex);
        //         requiredMatches--;
        //     } else {
        //         i--;
        //     }
        // } else {
        //     addWordToList(word, randomIndex);
        // }

    }
    return returnWords;
}

// generate junk/filler characters
// words: Array of words from "createOtherWords"
// settings: Object {}, ignored for now but will include information about setting up "helper" strings - dud removal, add time, reset tries, etc.
// removed for spacing issues - , '↑', '↓', '←', '→'
function generateJunk(words, settings = {}) {
    __powerUps = [];
    const junkCharacters = GameData.junkCharacters;
    // maxWords inherited from general scope
    let returnLines = [];

    let powerUpLines = [];
    // Determine which lines the power ups will get added to,
    // with logic to prevent duplicates
    for (let p = 0; p < 4; p++) {
        const powerUpLineIndex = randomNum(0, GameData.maxWords);
        if (powerUpLines.indexOf(powerUpLineIndex) < 0) {
            powerUpLines.push(powerUpLineIndex)
        } else {
            p--;
        }
    }
    let powerUpsAvailable = new Array(powerUpLines.length).fill(0);
    powerUpsAvailable.splice(randomNum(0, powerUpsAvailable.length), 1, 1);

    // Outer loop manages individual lines
    for (let l = 0; l < words.length; l++) {
        const word = words[l];
        let charsPerLine = GameData.charsPerLine;
        // let lineChars = [];
        let lineArray = [];
        let wordInsertIndex = randomNum(0, (charsPerLine - word.length));

        // prefill junk
        for (let c = 0; c < charsPerLine; c++) {
            lineArray.push(junkCharacters[randomNum(0, junkCharacters.length)]);
        }

        // does this line need a power up?
        if (powerUpLines.indexOf(l) > -1) {
            let coinFlip = randomNum(0, 2);
            let powerUpIndex = 0;
            let powerUpLength = randomNum(2, 5);
            let powerUpString = '';
            let powerUpType = 0;
            let powerUpTypeIndex = 0;

            // if coinFlip > 0, put the powerUp after the word,
            // else put it before the word
            if (coinFlip > 0) {
                wordInsertIndex = randomNum(0, (charsPerLine / 2 - word.length));
                powerUpIndex = randomNum((wordInsertIndex + word.length), (charsPerLine - powerUpLength));
            } else {
                powerUpIndex = randomNum(0, (charsPerLine / 2 - powerUpLength));
                wordInsertIndex = randomNum((powerUpIndex + powerUpLength), (charsPerLine - word.length));
            }

            // // create powerUp string
            for (let u = 0; u < powerUpLength; u++) {
                powerUpString += junkCharacters[randomNum(0, junkCharacters.length)];
            }

            powerUpType = powerUpsAvailable[randomNum(0, powerUpsAvailable.length)];
            powerUpTypeIndex = powerUpsAvailable.indexOf(powerUpType);
            powerUpsAvailable.splice(powerUpTypeIndex, 1);
            __powerUps.push({ puString: powerUpString, puType: powerUpType });

            // splice in our powerUp at previously randomized index
            lineArray.splice(powerUpIndex, powerUpString.length, powerUpString);
        }

        // splice in our word at random index
        lineArray.splice(wordInsertIndex, word.length, word);

        returnLines.push(lineArray);
    }
    return returnLines;
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function stringSplit(string) {
    return string.split('');
}

export function getStoredData() {
    try {
        const response = localStorage.getItem(userData);
        if (response) {
            const data = JSON.parse(response);
            return (data && data.score) ? data : GameData.defaultUserData;
        }
        return GameData.defaultUserData;
    } catch (e) {
        console.error(`getUserData: Error getting data for user: `, e);
        return GameData.defaultUserData;
    }
}

export function putStoredData(data) {
    localStorage.setItem(userData, JSON.stringify(data));
}
