/**
 * @file GameBoard.jsx
 * @author Alex Kachur
 * @since 2025-11-11
 * @purpose Interactive Family Feud board prototype with realistic round flow.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRIMARY_NAV_LINKS } from '../utils/navigation.js';

const SLOT_COUNT = 8;
const QUESTION_CARD_ASSET = '/Question_Card.png';
const TIMER_CARD_ASSET = '/Answer_Card_0.png';
const EMPTY_CARD_ASSET = '/Hidden_Card_Empty.png';
const HIDDEN_CARD_ASSETS = [
  '/Hidden_Card_1.png',
  '/Hidden_Card_2.png',
  '/Hidden_Card_3.png',
  '/Hidden_Card_4.png',
  '/Hidden_Card_5.png',
  '/Hidden_Card_6.png',
  '/Hidden_Card_7.png',
  '/Hidden_Card_8.png',
];

// Card slots are locked to their TV positions. Pair top rows as 1/4, 2/5, 3/6, then append any leftovers (7/8).
const DISPLAY_ORDER = (() => {
  const desiredPairings = [
    [0, 3], // 1 / 4
    [1, 4], // 2 / 5
    [2, 5], // 3 / 6
  ];
  const order = [];
  const used = new Set();

  desiredPairings.forEach(([leftIndex, rightIndex]) => {
    if (leftIndex < SLOT_COUNT && rightIndex < SLOT_COUNT) {
      order.push(leftIndex, rightIndex);
      used.add(leftIndex);
      used.add(rightIndex);
    }
  });

  for (let slotIndex = 0; slotIndex < SLOT_COUNT; slotIndex += 1) {
    if (!used.has(slotIndex)) {
      order.push(slotIndex);
    }
  }

  return order;
})();

// TODO: Hydrate these placeholders with real lobby/team assignments once auth/session wiring lands.
const PLAYER_PLACEHOLDERS = [
  {
    label: 'Team A',
    playerName: 'Player One',
    avatar: '/Default_Avatar.jpg',
    scoreCard: '/Answer_Card_50.png',
  },
  {
    label: 'Team B',
    playerName: 'Player Two',
    avatar: '/Default_Avatar.jpg',
    scoreCard: '/Answer_Card_50.png',
  },
];

// TODO: Replace this placeholder round data with the real JSON feed once the backend lands.
const ROUND_DATA = [
  {
    id: 'round-1',
    label: 'Round 1 · Single Points',
    overlayAsset: '/Round_One.png',
    multiplier: 1,
    question: 'Name something people double-check before leaving the house.',
    answers: [
      { answer: 'Lights off', points: 50, aliases: ['turn off lights', 'lights'] },
      { answer: 'Doors locked', points: 40, aliases: ['lock doors', 'doors'] },
      { answer: 'Stove or oven', points: 30, aliases: ['stove', 'oven', 'range'] },
      { answer: 'Wallet or purse', points: 20, aliases: ['wallet', 'purse'] },
      { answer: 'Car keys', points: 10, aliases: ['keys', 'car key'] },
      { answer: 'Phone', points: 5, aliases: ['cellphone', 'cell phone'] },
    ],
  },
  {
    id: 'round-2',
    label: 'Round 2 · Single Points',
    overlayAsset: '/Round_Two.png',
    multiplier: 1,
    question: 'Name a reason people wake up in the middle of the night.',
    answers: [
      { answer: 'Bathroom break', points: 50, aliases: ['use bathroom', 'bathroom'] },
      { answer: 'Noise', points: 40, aliases: ['loud noise', 'noises'] },
      { answer: 'Bad dream', points: 30, aliases: ['nightmare', 'dream'] },
      { answer: 'Thirsty', points: 20, aliases: ['get water', 'water'] },
      { answer: 'Check phone', points: 10, aliases: ['phone', 'texts'] },
      { answer: 'Hunger', points: 5, aliases: ['snack'] },
    ],
  },
  {
    id: 'round-3',
    label: 'Round 3 · Double Points',
    overlayAsset: '/Round_Three.png',
    multiplier: 2,
    question: 'Name something you always pack for a beach trip.',
    answers: [
      { answer: 'Sunscreen', points: 50, aliases: ['sunblock', 'sun screen'] },
      { answer: 'Towel', points: 40, aliases: ['beach towel'] },
      { answer: 'Swimsuit', points: 30, aliases: ['swim suit', 'trunks'] },
      { answer: 'Sunglasses', points: 20, aliases: ['glasses', 'shades'] },
      { answer: 'Flip-flops', points: 10, aliases: ['sandals'] },
      { answer: 'Snacks', points: 5, aliases: ['food'] },
    ],
  },
  {
    id: 'round-4',
    label: 'Round 4 · Triple Points',
    overlayAsset: '/Round_Four.png',
    multiplier: 3,
    question: 'Name something you do right before going to bed.',
    answers: [
      { answer: 'Brush teeth', points: 50, aliases: ['teeth', 'brush'] },
      { answer: 'Set alarm', points: 40, aliases: ['alarm clock', 'set the alarm'] },
      { answer: 'Check phone', points: 30, aliases: ['phone', 'scroll phone'] },
      { answer: 'Drink water', points: 20, aliases: ['glass of water'] },
      { answer: 'Read', points: 10, aliases: ['book', 'reading'] },
      { answer: 'Pray or meditate', points: 5, aliases: ['pray', 'meditate'] },
    ],
  },
];

const TIMER_CONFIG = {
  faceoffBuzz: 6,
  faceoffAnswer: 6,
  playGuess: 8,
  steal: 7,
  countdownGrace: 0.5,
};

const TIMER_LABELS = {
  faceoffBuzz: 'Face-off',
  faceoffAnswer: 'Answer',
  playGuess: 'Guess',
  steal: 'Steal',
};

const BUZZ_KEYS = ['Space', 'Spacebar'];
// TODO: Replace the shared spacebar buzzer with real buzz hardware / sockets.

const ANSWERING_PHASES = new Set(['faceoffAnswer', 'faceoffChallenger', 'playing', 'steal']);

function normalize(text) {
  return text.trim().toLowerCase();
}

function buildAnswerSlots(round) {
  const normalized = (round.answers ?? []).map((entry, index) => {
    if (!entry?.answer) return null;
    return {
      answer: entry.answer,
      points: entry.points ?? 0,
      rank: index + 1,
      matchers: [entry.answer, ...(entry.aliases ?? [])].map(normalize),
    };
  });
  return Array.from({ length: SLOT_COUNT }, (_, index) => normalized[index] ?? null);
}

function getOpponentIndex(playerIndex) {
  return (playerIndex + 1) % PLAYER_PLACEHOLDERS.length;
}

function isSpaceKey(event) {
  return BUZZ_KEYS.includes(event.code) || BUZZ_KEYS.includes(event.key) || event.key === ' ';
}

export default function GameBoard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const currentRound = ROUND_DATA[roundIndex] ?? ROUND_DATA[0];
  const gridAnswers = useMemo(() => buildAnswerSlots(currentRound), [currentRound]);
  const [revealedAnswers, setRevealedAnswers] = useState(() =>
    gridAnswers.map((answer) => (answer ? false : 'empty')),
  );
  const [phase, setPhase] = useState('intro');
  const [activePlayerIndex, setActivePlayerIndex] = useState(null);
  const [controlPlayer, setControlPlayer] = useState(null);
  const [buzzWinner, setBuzzWinner] = useState(null);
  const [faceoffLeader, setFaceoffLeader] = useState(null);
  const [roundPot, setRoundPot] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [scores, setScores] = useState(Array(PLAYER_PLACEHOLDERS.length).fill(0));
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [roundResult, setRoundResult] = useState(null);
  const inputRef = useRef(null);
  const faceoffCycleRef = useRef(0); // TODO: Replace this alternating tester logic with per-player buzz timestamps.
  const handleMissRef = useRef(() => {});

  const [timerState, setTimerState] = useState({ mode: null, remainingMs: 0 });
  const timerDeadlineRef = useRef(null);
  const timerCallbackRef = useRef(null);

  const toggleMenu = () => setMenuOpen((value) => !value);
  const closeMenu = () => setMenuOpen(false);

  const stopTimer = useCallback(() => {
    timerDeadlineRef.current = null;
    timerCallbackRef.current = null;
    setTimerState({ mode: null, remainingMs: 0 });
  }, []);

  const startTimer = useCallback(
    (mode, seconds, onExpire) => {
      const durationMs = seconds * 1000;
      const graceMs = TIMER_CONFIG.countdownGrace * 1000;
      timerDeadlineRef.current = performance.now() + durationMs + graceMs;
      timerCallbackRef.current = onExpire;
      setTimerState({ mode, remainingMs: durationMs + graceMs });
    },
    [],
  );

  useEffect(() => {
    if (!timerState.mode || !timerDeadlineRef.current) return undefined;

    const tick = () => {
      if (!timerDeadlineRef.current) return;
      const remainingMs = timerDeadlineRef.current - performance.now();
      setTimerState((prev) => (prev.mode ? { ...prev, remainingMs } : prev));
      if (remainingMs <= 0) {
        const callback = timerCallbackRef.current;
        stopTimer();
        callback?.();
      }
    };

    tick();
    const id = setInterval(tick, 150);
    return () => clearInterval(id);
  }, [timerState.mode, stopTimer]);

  const enterFaceoffBuzz = useCallback(() => {
    stopTimer();
    setPhase('faceoffBuzz');
    setGuess('');
    setFeedback('');
    setActivePlayerIndex(null);
    setBuzzWinner(null);
    setFaceoffLeader(null);
    faceoffCycleRef.current = 0;
    startTimer('faceoffBuzz', TIMER_CONFIG.faceoffBuzz, () => {
      setFeedback('No buzz detected. Host repeats the question.');
      enterFaceoffBuzz();
    });
  }, [startTimer, stopTimer]);

  useEffect(() => {
    setRevealedAnswers(gridAnswers.map((answer) => (answer ? false : 'empty')));
    setRoundPot(0);
    setStrikes(0);
    setControlPlayer(null);
    setBuzzWinner(null);
    setFaceoffLeader(null);
    setRoundResult(null);
    setFeedback('');
    setGuess('');
    setPhase('intro');
    stopTimer();
  }, [gridAnswers, stopTimer]);

  useEffect(() => {
    if (phase !== 'intro') return undefined;
    const introTimer = setTimeout(() => setPhase('questionZoom'), 2000);
    return () => clearTimeout(introTimer);
  }, [phase]);

  const finalizeRound = useCallback(
    (winnerIndex, note) => {
      stopTimer();
      // TODO: Broadcast this round result to connected clients so remote players stay in sync.
      if (winnerIndex !== null && winnerIndex !== undefined) {
        setScores((prev) => {
          const updated = [...prev];
          updated[winnerIndex] += roundPot;
          return updated;
        });
      }
      setRoundResult({ winnerIndex, points: roundPot, note });
      setPhase(roundIndex < ROUND_DATA.length - 1 ? 'roundSummary' : 'gameComplete');
      setFeedback(note ?? '');
    },
    [roundIndex, roundPot, stopTimer],
  );

  // Central timeout/miss handler so every phase (face-off, board play, steal) advances consistently.
  const handleMiss = useCallback(
    (reason) => {
      stopTimer();
      if (phase === 'faceoffAnswer') {
        const challenger = getOpponentIndex(buzzWinner ?? 0);
        setFeedback(
          reason === 'timeout'
            ? 'Time expired! Opponent gets a shot.'
            : 'Not on the board. Opponent gets a shot.',
        );
        setPhase('faceoffChallenger');
        setActivePlayerIndex(challenger);
        startTimer('faceoffAnswer', TIMER_CONFIG.faceoffAnswer, () => handleMissRef.current?.('timeout'));
        return;
      }
      if (phase === 'faceoffChallenger') {
        setFeedback(
          reason === 'timeout'
            ? 'Challenger ran out of time. Restarting the face-off.'
            : 'Still nothing. Resetting the face-off.',
        );
        enterFaceoffBuzz();
        return;
      }
      if (phase === 'playing') {
        setStrikes((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            const stealPlayer = getOpponentIndex(controlPlayer ?? 0);
            setFeedback(
              reason === 'timeout'
                ? 'Too slow—three strikes! Opponent can steal.'
                : 'Three strikes! Opponent can steal.',
            );
            setPhase('steal');
            setActivePlayerIndex(stealPlayer);
            startTimer('steal', TIMER_CONFIG.steal, () =>
              finalizeRound(controlPlayer ?? 0, 'Steal attempt expired.'),
            );
          } else {
            setFeedback(
              reason === 'timeout'
                ? `Strike ${next}! Timer ran out—still your board.`
                : `Strike ${next}! Still your board.`,
            );
            startTimer('playGuess', TIMER_CONFIG.playGuess, () => handleMissRef.current?.('timeout'));
          }
          return next;
        });
        return;
      }
      if (phase === 'steal') {
        setFeedback(
          reason === 'timeout'
            ? 'Steal timer expired. Control keeps the pot.'
            : 'Steal missed. Control keeps the pot.',
        );
        finalizeRound(controlPlayer ?? 0, 'Defended the board.');
      }
    },
    [buzzWinner, controlPlayer, enterFaceoffBuzz, finalizeRound, phase, startTimer, stopTimer],
  );

  handleMissRef.current = handleMiss;

  const finalizeFaceoffControl = useCallback(
    (playerIndex, note) => {
      stopTimer();
      setControlPlayer(playerIndex);
      setActivePlayerIndex(playerIndex);
      setPhase('playOrPass');
      setFeedback(
        `${PLAYER_PLACEHOLDERS[playerIndex].label} controls the board${note ? ` – ${note}` : ''}. Choose play or pass.`,
      );
      setFaceoffLeader(null);
    },
    [stopTimer],
  );

  const handleCorrectAnswer = useCallback(
    (matchIndex) => {
      const slot = gridAnswers[matchIndex];
      if (!slot) {
        handleMiss('invalid');
        return;
      }
      if (revealedAnswers[matchIndex] !== false) {
        handleMiss('duplicate');
        return;
      }

      setRevealedAnswers((prev) => {
        const updated = [...prev];
        updated[matchIndex] = true;
        return updated;
      });
      setRoundPot((value) => value + slot.points * currentRound.multiplier);

      if (phase === 'faceoffAnswer') {
        if (slot.rank === 1) {
          finalizeFaceoffControl(activePlayerIndex ?? 0, 'Hit the #1 answer');
        } else {
          setFaceoffLeader({ playerIndex: activePlayerIndex ?? 0, rank: slot.rank });
          const challenger = getOpponentIndex(activePlayerIndex ?? 0);
          setActivePlayerIndex(challenger);
          setPhase('faceoffChallenger');
          setFeedback(
            `${PLAYER_PLACEHOLDERS[challenger].label} must beat rank #${slot.rank} to take control.`,
          );
          startTimer('faceoffAnswer', TIMER_CONFIG.faceoffAnswer, () => handleMissRef.current?.('timeout'));
        }
        return;
      }

      if (phase === 'faceoffChallenger') {
        if (!faceoffLeader) {
          finalizeFaceoffControl(activePlayerIndex ?? 0, 'Opponent missed the board.');
          return;
        }
        const challengerRank = slot.rank;
        const winner =
          challengerRank < faceoffLeader.rank ? activePlayerIndex ?? 0 : faceoffLeader.playerIndex;
        const reason =
          challengerRank < faceoffLeader.rank ? 'Higher-ranked face-off answer.' : 'Face-off leader held control.';
        finalizeFaceoffControl(winner, reason);
        return;
      }

      if (phase === 'playing') {
        const hasHiddenCards = revealedAnswers.some((value, index) => index !== matchIndex && value === false);
        if (!hasHiddenCards) {
          finalizeRound(controlPlayer ?? activePlayerIndex ?? 0, 'Cleared the board!');
        } else {
          setFeedback('Correct! Keep going.');
          startTimer('playGuess', TIMER_CONFIG.playGuess, () => handleMissRef.current?.('timeout'));
        }
        return;
      }

      if (phase === 'steal') {
        const stealer = activePlayerIndex ?? 0;
        finalizeRound(stealer, `${PLAYER_PLACEHOLDERS[stealer].label} stole the round!`);
      }
    },
    [
      activePlayerIndex,
      controlPlayer,
      currentRound.multiplier,
      faceoffLeader,
      finalizeFaceoffControl,
      finalizeRound,
      gridAnswers,
      handleMiss,
      phase,
      revealedAnswers,
      startTimer,
    ],
  );

  const beginPlaying = useCallback(
    (playerIndex) => {
      stopTimer();
      setPhase('playing');
      setActivePlayerIndex(playerIndex);
      setFeedback(`${PLAYER_PLACEHOLDERS[playerIndex].label} is playing the board.`);
      startTimer('playGuess', TIMER_CONFIG.playGuess, () => handleMissRef.current?.('timeout'));
    },
    [startTimer, stopTimer],
  );

  const handleControlChoice = (choice) => {
    const owner = controlPlayer ?? 0;
    const target = choice === 'play' ? owner : getOpponentIndex(owner);
    setControlPlayer(target);
    beginPlaying(target);
  };

  const handleGuessSubmit = (event) => {
    event.preventDefault();
    if (!ANSWERING_PHASES.has(phase)) return;
    const cleaned = normalize(guess);
    if (!cleaned) return;
    stopTimer();
    const matchIndex = gridAnswers.findIndex(
      (slot, index) => slot && revealedAnswers[index] === false && slot.matchers.includes(cleaned),
    );
    if (matchIndex === -1) {
      setFeedback('No match. That counts as a strike.');
      handleMiss('no-match');
    } else {
      handleCorrectAnswer(matchIndex);
    }
    setGuess('');
  };

  const handleBuzz = useCallback(
    (force = false) => {
      if (!force && phase !== 'faceoffBuzz') return;
      const playerIndex = faceoffCycleRef.current % PLAYER_PLACEHOLDERS.length;
      faceoffCycleRef.current += 1;
      stopTimer();
      setBuzzWinner(playerIndex);
      setActivePlayerIndex(playerIndex);
      setPhase('faceoffAnswer');
      setFeedback(`${PLAYER_PLACEHOLDERS[playerIndex].label} buzzed first—answer now!`);
      setGuess('');
      startTimer('faceoffAnswer', TIMER_CONFIG.faceoffAnswer, () => handleMissRef.current?.('timeout'));
    },
    [phase, startTimer, stopTimer],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isSpaceKey(event)) return;
      if (phase === 'questionZoom') {
        event.preventDefault();
        enterFaceoffBuzz();
        setTimeout(() => handleBuzz(true), 0);
      } else if (phase === 'faceoffBuzz') {
        event.preventDefault();
        handleBuzz();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enterFaceoffBuzz, handleBuzz, phase]);

  useEffect(() => {
    if (ANSWERING_PHASES.has(phase)) {
      inputRef.current?.focus();
    }
  }, [phase]);

  const advanceRound = () => {
    if (roundIndex < ROUND_DATA.length - 1) {
      setRoundIndex((value) => value + 1);
    } else {
      setScores(Array(PLAYER_PLACEHOLDERS.length).fill(0));
      setRoundIndex(0);
    }
  };

  const graceMs = TIMER_CONFIG.countdownGrace * 1000;
  const timerSecondsRemaining = timerState.mode
    ? Math.max(0, Math.ceil(Math.max(0, timerState.remainingMs - graceMs) / 1000))
    : null;
  const timerDisplay = timerSecondsRemaining ?? '–';
  const timerIsCritical = timerState.mode && (timerSecondsRemaining ?? 0) <= 3;
  const timerLabel = timerState.mode ? TIMER_LABELS[timerState.mode] : 'Timer';
  const instructionFallback =
    {
      faceoffBuzz: 'Buzz in with the spacebar.',
      playOrPass: 'Choose to play the board or pass control.',
      steal: 'One guess to steal the board.',
      playing: 'Guess one answer at a time. Three strikes ends the turn.',
    }[phase] ?? '';
  const activeInstruction =
    (activePlayerIndex === null && feedback) || instructionFallback || 'Ready for the next cue.';
  const strikesDisplay = Array.from({ length: 3 }, (_, index) => (
    <span key={index} className={index < strikes ? 'is-hit' : ''}>
      X
    </span>
  ));

  const formPlaceholder =
    {
      faceoffAnswer: 'Face-off guess',
      faceoffChallenger: 'Challenge guess',
      playing: 'Enter board answer',
      steal: 'Steal guess',
    }[phase] ?? 'Input disabled';

  const roundComplete = phase === 'roundSummary' || phase === 'gameComplete';
  const showPlayOrPassActions = phase === 'playOrPass';
  const showRoundAdvanceAction = roundComplete;
  const roundOverlayAsset = currentRound.overlayAsset ?? '/Round_One.png';

  return (
    <div className="landing-basic game-board">
      <header className="landing-basic__chrome">
        <button
          type="button"
          className="landing-basic__menu"
          aria-label="Open navigation"
          aria-controls="gameboard-drawer"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <main className="landing-basic__body game-board__body">
        <div className="game-board__stage">
          <img
            src="/Gameboard_Backround.jpg"
            alt="Family Feud stage backdrop"
            className="game-board__bg"
            loading="lazy"
          />

          {phase === 'intro' ? (
            <div className="game-board-round-intro" aria-label="Round intro">
              <div className="game-board-round-intro__logo">
                <img src={roundOverlayAsset} alt="Round splash" />
                <span>{currentRound.label}</span>
              </div>
            </div>
          ) : null}

          {phase === 'questionZoom' || phase === 'faceoffBuzz' ? (
            <div className="game-board-question-overlay" aria-live="polite">
              <div
                className="game-board-question-overlay__card"
                style={{ backgroundImage: `url(${QUESTION_CARD_ASSET})` }}
              >
                <p>{currentRound.question}</p>
              </div>
              <span>Buzz with spacebar</span>
            </div>
          ) : null}

          <div className="game-board__content">
            <div
              className="game-board-question"
              aria-label="Question plaque"
              style={{ backgroundImage: `url(${QUESTION_CARD_ASSET})` }}
            >
              <p className="game-board-question__text">{currentRound.question}</p>
            </div>

            <div className="game-board-info-row">
              <div className="game-board-round-meta">
                <div className="game-board-round-meta__item">{currentRound.label}</div>
                <div className="game-board-round-meta__item">
                  Pot: {roundPot} pts · x{currentRound.multiplier}
                </div>
              </div>

              <div
                className={`game-board-timer${timerIsCritical ? ' game-board-timer--critical' : ''}`}
                aria-label="Timer plaque"
                style={{ backgroundImage: `url(${TIMER_CARD_ASSET})` }}
              >
                <span className="game-board-timer__label">{timerLabel}</span>
                <span className="game-board-timer__value">{timerDisplay}</span>
              </div>

              <div className="game-board-round-meta game-board-round-meta--right">
                <div className="game-board-round-meta__item game-board-strikes">
                  Strikes: {strikesDisplay}
                </div>
                {controlPlayer !== null ? (
                  <div className="game-board-round-meta__item game-board-control-tag">
                    Control: {PLAYER_PLACEHOLDERS[controlPlayer].label}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="game-board-board">
              <section className="game-board-grid" aria-label="Answer card placeholders">
                {DISPLAY_ORDER.map((slotIndex) => {
                  const slot = gridAnswers[slotIndex];
                  const slotState = revealedAnswers[slotIndex];
                  let cardAsset = EMPTY_CARD_ASSET;
                  if (slot) {
                    cardAsset =
                      slotState === true
                        ? `/Answer_Card_${slot.points}.png`
                        : HIDDEN_CARD_ASSETS[slotIndex] ?? EMPTY_CARD_ASSET;
                  }
                  const revealed = slot && slotState === true;
                  return (
                    <div
                      key={slotIndex}
                      className={`game-board-grid__slot${revealed ? ' game-board-grid__slot--revealed' : ''}${
                        slotState === 'empty' ? ' game-board-grid__slot--empty' : ''
                      }`}
                      style={{ backgroundImage: `url(${cardAsset})` }}
                    >
                      {revealed ? (
                        <div className="game-board-grid__slot-text">
                          <span className="game-board-grid__slot-rank">{slot.rank}</span>
                          <span className="game-board-grid__slot-answer">{slot.answer}</span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </section>

              <div className="game-board-sides" aria-label="Player placeholders">
                {PLAYER_PLACEHOLDERS.map((player, index) => {
                  const isActive = index === activePlayerIndex;
                  const hasControl = controlPlayer === index;
                  const showPlayControlsForPlayer = showPlayOrPassActions && hasControl;
                  const winnerIndex = roundResult?.winnerIndex;
                  const showAdvanceForPlayer =
                    showRoundAdvanceAction &&
                    (winnerIndex === index ||
                      (winnerIndex === null || winnerIndex === undefined ? hasControl : false));

                  let playerMessage = '\u00A0';
                  if (isActive && feedback) {
                    playerMessage = feedback;
                  } else if (!isActive && (phase === 'faceoffBuzz' || phase === 'questionZoom')) {
                    playerMessage = 'Buzz with spacebar';
                  } else if (showPlayControlsForPlayer) {
                    playerMessage = 'Choose play or pass';
                  } else if (showAdvanceForPlayer) {
                    playerMessage = phase === 'gameComplete' ? 'Restart the game' : 'Advance to next round';
                  } else if (isActive) {
                    playerMessage = activeInstruction;
                  }

                  return (
                    <div
                      className={`game-board-player${isActive ? ' game-board-player--active' : ''}`}
                      key={player.label}
                    >
                      <p className="game-board-player__team">{player.label}</p>
                      <p className="game-board-player__name">{player.playerName}</p>
                      <p
                        className="game-board-player__status"
                        aria-live={isActive ? 'polite' : undefined}
                      >
                        {playerMessage}
                      </p>
                      <div
                        className="game-board-player__avatar"
                        style={{ backgroundImage: `url(${player.avatar})` }}
                      />
                      <div
                        className="game-board-player__score"
                        style={{ backgroundImage: `url(${player.scoreCard})` }}
                      >
                        <span>{String(scores[index]).padStart(3, '0')}</span>
                      </div>
                      {showPlayControlsForPlayer ? (
                        <div className="game-board-player__actions">
                          <button type="button" onClick={() => handleControlChoice('play')}>
                            Play it
                          </button>
                          <button type="button" onClick={() => handleControlChoice('pass')}>
                            Pass it
                          </button>
                        </div>
                      ) : null}
                      {showAdvanceForPlayer ? (
                        <div className="game-board-player__actions">
                          <button type="button" onClick={advanceRound}>
                            {phase === 'gameComplete' ? 'Restart game' : 'Next round'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="game-board-console" aria-live="polite">
              <div className="game-board-input" aria-label="Answer input placeholder">
                <form className="game-board-answer-form" onSubmit={handleGuessSubmit}>
                  <label className="sr-only" htmlFor="gameboard-guess">
                    Enter guess
                  </label>
                  <input
                    id="gameboard-guess"
                    ref={inputRef}
                    type="text"
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    placeholder={formPlaceholder}
                    disabled={!ANSWERING_PHASES.has(phase)}
                  />
                  <button type="submit" disabled={!ANSWERING_PHASES.has(phase)}>
                    Lock In
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {menuOpen ? (
        <button type="button" className="landing-basic__backdrop" aria-label="Close menu" onClick={closeMenu} />
      ) : null}
      <nav
        id="gameboard-drawer"
        className={`landing-basic__drawer${menuOpen ? ' landing-basic__drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <button type="button" className="landing-basic__drawer-close" onClick={closeMenu} aria-label="Close menu">
          ×
        </button>
        <ul className="landing-basic__drawer-list">
          {PRIMARY_NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link to={link.path} onClick={closeMenu}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
