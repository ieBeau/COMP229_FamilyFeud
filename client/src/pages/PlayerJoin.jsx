/**
 * @file PlayerJoin.jsx
 * @author Alex Kachur
 * @since 2025-11-04
 * @purpose Join surface for contestants entering a Family Feud session.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { PRIMARY_NAV_LINKS } from '../utils/navigation.js';

import PageSection from '../components/PageSection.jsx';

export default function PlayerJoin() {
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="game_theme">
      <header className="landing-basic__chrome">
        <button
          type="button"
          className="landing-basic__menu"
          aria-label="Open navigation"
          aria-controls="landing-drawer"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      <div className="page page--centered">
        <header className="page__header">
          <p className="eyebrow">Contestant Lobby</p>
          <h2>Join a Game</h2>
          <p>Enter the access code provided by your host to buzz in.</p>
        </header>

        <PageSection title="Access Code" description="Codes refresh for every new lobby to prevent random joins.">
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/under-construction');
            }}
          >
            <label htmlFor="join-access-code">
              Access Code
              <input
                id="join-access-code"
                name="accessCode"
                type="text"
                inputMode="numeric"
                placeholder="842159"
              />
            </label>
            <label htmlFor="join-display-name">
              Display Name
              <input
                id="join-display-name"
                name="displayName"
                type="text"
                placeholder="Team Captain"
              />
            </label>
            <button type="submit">Request Entry</button>
          </form>
          {/* TODO (Backend Team): POST /api/player-sessions/join should validate code and return player token. */}
        </PageSection>

        <PageSection title="Buzzer" description="Triggers once the host opens the question faceoff.">
          <button type="button" className="buzzer" onClick={() => navigate('/under-construction')}>Buzz</button>
          {/* TODO (Backend Team): open WebSocket channel for near-real-time buzzer latency handling. */}
        </PageSection>
      </div>
      {/* Simple slide-out drawer for quick navigation while on the landing view. */}
      {menuOpen ? <button className="landing-basic__backdrop" aria-label="Close menu" onClick={closeMenu} /> : null}
      <nav
        id="landing-drawer"
        className={"landing-basic__drawer" + (menuOpen ? " landing-basic__drawer--open" : "")}
        aria-hidden={!menuOpen}
      >
        <button type="button" className="landing-basic__drawer-close" onClick={closeMenu} aria-label="Close menu">
          ×
        </button>
        <ul className="landing-basic__drawer-list">
          {PRIMARY_NAV_LINKS.map(link => (
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
