import SelectDifficulty from './selectDifficulty';
import './message.css';

// floating window for displaying game-relevant information,
// e.g. "You win!", "You lose!", etc.
export default function Message({ data, cb, closeCb }) {
    return (
        <section className={`message-box ${(data.title) ? "show" : "hide"}`}>
            <div className="message-box-container">
                <h4>{data.title}</h4>
                <div className="message-box-msg">{data.text}</div>
                {(data.includeReset)
                    ? <SelectDifficulty cb={cb} />
                    : <button className="message-box-close" onClick={closeCb}><span className="material-symbols-outlined">close</span></button>
                }
            </div>
        </section>
    )
}
