/**
 * @file GameBoard.jsx
 * @author Alex Kachur
 * @since 2025-11-11
 * @purpose Shows the board background, reusable nav, and a 2x4 table placeholder for answer cards.
 */
import LandingNavControls from '../components/LandingNavControls.jsx';

const SLOT_COUNT = 8;

export default function GameBoard() {
  return (
    <div className="landing-basic game-board">
      <LandingNavControls drawerId="landing-drawer-board" hideButtonWhenOpen={false} />

      <main className="landing-basic__body game-board__body">
        <div className="game-board__stage">
          <img
            src="/Gameboard_Backround.jpg"
            alt="Family Feud stage backdrop"
            className="game-board__bg"
            loading="lazy"
          />

          <div className="game-board__content">
            <div className="game-board-question" aria-label="Question placeholder" />

            <div className="game-board-timer" aria-label="Timer placeholder" />

            <div className="game-board-board">
              <section className="game-board-grid" aria-label="Answer card placeholders">
                {Array.from({ length: SLOT_COUNT }).map((_, index) => (
                  <div key={index} className="game-board-grid__slot" />
                ))}
              </section>

              <div className="game-board-sides" aria-label="Player placeholders">
                <div className="game-board-player">
                  <div className="game-board-player__avatar" />
                  <div className="game-board-player__score" />
                </div>
                <div className="game-board-player">
                  <div className="game-board-player__avatar" />
                  <div className="game-board-player__score" />
                </div>
              </div>
            </div>

            <div className="game-board-input" aria-label="Answer input placeholder" />
          </div>
        </div>
      </main>
    </div>
  );
}
