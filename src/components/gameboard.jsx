import { createElement, useEffect, useState } from 'react';
import { createBoard, evalPowerUp, evalWord, getDud, getStoredData, putStoredData } from '../services/gameService';
import { GameData } from '../services/gameData';
import Message from './message';
import NewGame from './newGame';
import TriesLeft from './triesLeft';
import UserStats from './userStats';
import './gameboard.css';

export default function GameBoard() {
    // State vars
    const [difficultyLevel, setDifficultyLevel] = useState(0);
    const [msgData, setMsgData] = useState({});
    const [powerUpsUsed, setPowerUpsUsed] = useState([]);
    const [puzzleLinesList, setPuzzleLinesList] = useState([]);
    const [triedMatches, setTriedMatches] = useState([]);
    const [triesLeft, setTriesLeft] = useState(GameData.maxTries);
    const [triesLog, setTriesLog] = useState([]);
    const [userData, setUserData] = useState(GameData.defaultUserData);

    useEffect(() => {
        const storedUserData = getStoredData();
        setUserData(storedUserData);
    }, []);

    function checkMatch(word) {
        if (triesLeft < 1) return; // probably unnecessary, but implemented to prevent DOM hack cheating

        const result = evalWord(word); // returns an obj: { match: boolean, totalMatches: correct letters, message: string }

        if (result.match) {
            updateUserData(true);
            setMsgData({ includeReset: true, title: 'Success!', text: `The correct password was "${word}"` });
        } else if ((triesLeft - 1) > 0) {
            // state vars don't update until re-hydration, so manually test and then set new value
            setTriesLeft(triesLeft - 1);
            const triedCopy = [...triedMatches];
            triedCopy.push(word);
            setTriedMatches(triedCopy);
            const attempt = { word: word, matches: result.totalMatches };
            const logCopy = [...triesLog];
            logCopy.push(attempt);
            setTriesLog(logCopy);
        } else {
            updateUserData(false);
            setMsgData({ includeReset: true, title: 'Game Over :(', text: `You were unable to hack this machine. Try again?` });
        }
    }

    function closeMessageWin() {
        setMsgData({});
    }

    function displayFullStats() {
        const stats = userData.stats;
        let statsDom = [];

        function createRowEl(difficulty, wins, losses) {
            return createElement(
                'div',
                {
                    className: 'stats flex row',
                    key: `d-${difficulty}`,
                },
                `${difficulty} - Wins: ${wins}, Losses: ${losses}`
            )
        }

        for (const d in stats) {
            const difficulty = GameData.difficulties.find((gd) => Number(gd.letters) === Number(d));
            statsDom.push(createRowEl(difficulty.name, stats[d][0], stats[d][1]))

        }

        const messageDom = createElement(
            'div',
            {
                className: 'stats-container flex'
            },
            statsDom
        )

        setMsgData({ includeReset: false, title: 'Full Win/Loss Statistics', text: messageDom });
    }

    function spendPowerUp(puString) {
        const result = evalPowerUp(puString);
        let logMessage = "";

        // this could currently work as if/else, but I'm planning to add more
        switch (result.puType) {
            case 1:
                setTriesLeft(GameData.maxTries);
                logMessage = result.message;
                break;
            case 0:
                const dud = getDud(triedMatches);
                logMessage = `${result.message}: ${dud}`;
                const triedCopy = [...triedMatches];
                triedCopy.push(dud);
                setTriedMatches(triedCopy);
                break;
            default:
                logMessage = `Something went wrong parsing that code!`;
                break;
        }

        // Log the power up used to the fake DOM "console"
        const attempt = { message: logMessage }
        const logCopy = [...triesLog];
        logCopy.push(attempt);
        setTriesLog(logCopy);

        // record the power up used so it can be removed from the board
        const puUsedCopy = [...powerUpsUsed];
        puUsedCopy.push(puString);
        setPowerUpsUsed(puUsedCopy);
    }

    function logTries() {
        const printLog = triesLog.map((attempt, i) =>
            // attempt == { word: word, matches: result.totalMatches, message: result.message }
            (attempt.message)
                ? <li className="non-word-msg" key={`attempt-${i}`}>{attempt.message}</li>
                : <li key={`attempt-${i}`}>"{attempt.word}", {attempt.matches} matches.</li>
        );
        return <ul className="attempt-log">{printLog}</ul>
    }

    function printLines() {
        let parentDom = [];
        const halfMark = puzzleLinesList.length / 2;

        function createColumn(innerDom, colIndex) {
            const colKey = `c-${colIndex}`;
            return createElement(
                'div',
                {
                    className: 'puzzle-board-col',
                    key: colKey,
                },
                innerDom
            )
        }

        function createLine(innerDom, lineIndex) {
            const lineKey = `l-${lineIndex}`
            return createElement(
                'div',
                {
                    className: 'puzzle-board-row',
                    key: lineKey,
                },
                innerDom
            )
        }

        function insertItem(item, itemIndex) {
            let props = { key: `i-${itemIndex}` };

            if (item && item.length > 1) {
                // use value of item to determine props
                const itemArray = item.split('');
                if (GameData.junkCharacters.indexOf(itemArray[0]) < 0) {
                    if (triedMatches.indexOf(item) < 0) {
                        props.className = `puzzle-board-word`;
                        props.onClick = () => { checkMatch(item) };
                    } else {
                        props.className = `puzzle-board-word strike`;
                    }
                } else {
                    if (powerUpsUsed.indexOf(item) < 0) {
                        props.className = `puzzle-board-powerup`;
                        props.onClick = () => { spendPowerUp(item) };
                    } else {
                        props.className = `puzzle-board-powerup strike`
                    }
                }
            }

            return createElement(
                'span',
                { ...props },
                item
            )
        }

        // loop cols / rows / lines and generate DOM accordingly
        for (let c = 0; c < 2; c++) {
            let colDom = [];
            for (let r = (halfMark * c); r < (halfMark * (c + 1)); r++) {
                const lineItems = puzzleLinesList[r];
                let lineDom = [];
                for (let l = 0; l < lineItems.length; l++) {
                    lineDom.push(insertItem(lineItems[l], c.toString() + r.toString() + l.toString()));
                }

                colDom.push(createLine(lineDom, c.toString() + r.toString()));
            }
            parentDom.push(createColumn(colDom, c.toString()));
        }

        return createElement(
            'div',
            { className: `puzzle-board flex row` },
            parentDom
        );
    }

    function resetBoard(difficulty) {
        if (difficulty > 0) {
            setDifficultyLevel(difficulty);
            setMsgData({});
            setPuzzleLinesList(createBoard(difficulty));
            setTriedMatches([])
            setTriesLeft(GameData.maxTries);
            setTriesLog([]);
        }
    }

    function updateUser(data) {
        putStoredData(data);
        setUserData(data);
    }

    // update the user data,
    // wonOrLost: boolean - true if won, false if lost
    function updateUserData(wonOrLost) {
        let userCopy = { ...userData };
        if (wonOrLost) {
            userCopy.score += (difficultyLevel * 25);
            userCopy.stats[difficultyLevel][0]++;
        } else {
            userCopy.stats[difficultyLevel][1]++;
        }
        updateUser(userCopy);
    }

    return (
        <section className={`gameboard-container ${(difficultyLevel === 0) ? "new" : "active"}`}>
            <h1 className="flex row">Hackatron 3000</h1>
            <div className="flex row main-container">
                <div className="flex col main">
                    {
                        (difficultyLevel === 0) ? (
                            <NewGame cb={resetBoard} />
                        ) : (
                            <div className="gameboard-active-game">
                                <UserStats data={{ ...userData, difficulty: difficultyLevel }} displayFull={displayFullStats} />
                                <TriesLeft triesLeft={triesLeft} />
                                {printLines()}
                                <Message data={msgData} cb={resetBoard} closeCb={closeMessageWin} />
                            </div>
                        )
                    }
                </div>
                <div className="flex col log-container">
                    <h3>Feedback Log:</h3>
                    {logTries()}
                </div>
            </div>
        </section>
    )
};
