/**
 * @file LandingNavControls.jsx
 * @author Alex Kachur
 * @since 2025-11-11
 * @purpose Provides reusable hamburger menu + drawer.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRIMARY_NAV_LINKS } from '../utils/navigation.js';

/**
 * Renders the hamburger trigger, backdrop, and slide-out drawer used on landing pages.
 * @param {Object} props component props
 * @param {string} [props.drawerId] optional DOM id for the drawer element
 * @param {boolean} [props.hideButtonWhenOpen] hide the hamburger while the drawer is open
 * @returns {JSX.Element}
 */
export default function LandingNavControls({
  drawerId = 'landing-drawer',
  hideButtonWhenOpen = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((value) => !value);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="landing-basic__chrome">
        {menuOpen && hideButtonWhenOpen ? null : (
          <button
            type="button"
            className="landing-basic__menu"
            aria-label="Open navigation"
            aria-controls={drawerId}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="landing-basic__backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}

      <nav
        id={drawerId}
        className={`landing-basic__drawer${menuOpen ? ' landing-basic__drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="landing-basic__drawer-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
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
    </>
  );
}
