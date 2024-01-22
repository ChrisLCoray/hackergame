import { GameData } from '../services/gameData';
import './userStats.css';

export default function UserStats({ data, displayFull }) {
    const difficulty = GameData.difficulties.find((d) => d.letters === data.difficulty)

    function winLossRatioCurrent(winLoss) {
        let totalLosses = 0;
        let totalWins = 0;

        for (const key in winLoss) {
            totalWins += winLoss[key][0];
            totalLosses += winLoss[key][1];
        }
        return `Wins: ${totalWins}, Losses: ${totalLosses}`;
    }

    return (
        <div className="user-stats">
            <div className="user-stats-score">Score: {data.score}</div>
            <div className="user-stats-difficulty">Current Difficulty: {difficulty.name}</div>
            <div className="user-stats-wl">{winLossRatioCurrent(data.stats)}</div>
            <button className="user-stats-full" onClick={displayFull}>
                <span className="material-symbols-outlined">info</span>
            </button>
        </div>
    )
}


