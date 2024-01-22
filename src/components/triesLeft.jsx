import './triesLeft.css';

export default function TriesLeft({ triesLeft }) {
    return (
        <div className="puzzle-board-info flex row tries-left">
            Attempts Remaining: {triesLeft}
        </div>
    )
}
