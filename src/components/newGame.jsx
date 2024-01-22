import { useState } from 'react';
import SelectDifficulty from './selectDifficulty';
import './newGame.css';

export default function NewGame({ cb }) {
    const [currentPage, setCurrentPage] = useState(1);

    function advancePage(e) {
        e.preventDefault();
        let newPage = currentPage * 1;
        console.log(`newPage 1 = ${newPage}`);
        newPage++;
        setCurrentPage(newPage);
        console.log(`newPage 2 = ${newPage}`);
    }

    return (
        <section className="newgame-container">
            <h3>Instructions:</h3>
            {
                (currentPage === 1) ? (
                    <div className="newgame-page" id="page-1">
                        <p>Welcome to Hackatron 3000!</p>
                        <p>The object of this game is to "hack" the computer system by guessing the password. For the moment, it is recommended you use a device with a mouse like a desktop or laptop. There are elements of the game that will be difficult to use on a touchscreen device (like a tablet or phone).</p>
                        <p>If you are familiar with <a href="https://fallout.bethesda.net/en/games/fallout-4" rel="noreferrer" target="_blank">Fallout 4</a> from Bethesda Softworks/ZeniMax, this is essentially a stand-alone version of the computer hacking minigame, re-created for browsers in JavaScript.</p>
                        <p className="margin-b">To start, guess a word from the provided list. If your guess contains a letter in the same placement as the password, it will tell you the number of matches. For example, if the correct password is "live," and your guess is "list," it will let you know that two of the four letters&mdash;"l" and "i"&mdash;are correct. If your next guess was "evil," even though it contains all of the same letters as "live", none of them are in the correct placement, so it gets zero matches. Only correct letters in the correct placement can match.</p>
                        <button onClick={advancePage}>Next <span className="material-symbols-outlined">navigate_next</span></button>
                    </div>
                ) : (
                    <div className="newgame-page" id="page-2">
                        <p>Using this feedback, narrow down the potential list of words. However, you only start with four attempts. If after the fourth attempt, you do not succeed, you will fail and the client computer system will boot you back out.</p>
                        <p>If you win, you score points. Your game stats are stored on your local machine, so if you clear your cache completely, your score may reset (for the nerds, it's stored in `localStorage`).</p>
                        <p>To help you out, there are also "code fragments" in the body of the text. Clicking these fragments can do one of two things: Remove a "dud" from the list, or reset your tries. The easiest way to find these fragments is to move your mouse pointer over the non-word characters and look for a string that shows up with a <span className="highlight">highlight</span>.</p>
                        <p className="margin-b">To get started, select a difficulty below:</p>
                        <SelectDifficulty cb={cb} />
                    </div>
                )
            }
        </section>
    )
}
