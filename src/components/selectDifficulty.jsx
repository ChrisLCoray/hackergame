import { GameData } from '../services/gameData';
import './selectDifficulty.css';

export default function SelectDifficulty({ cb }) {
    function printDifficulties() {
        return GameData.difficulties.map(diff => <button onClick={() => { cb(diff.letters) }} key={`diff-${diff.letters}`}>{diff.name}: {diff.letters} Letters</button>);
    }
    return (
        <div className="select-difficulty-container">
            {printDifficulties()}
        </div>
    )
}
