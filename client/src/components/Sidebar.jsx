
/**
 * @file Sidebar.jsx
 * @author Pierre Moreau
 * @since 2025-11-26
 * @purpose Sidebar component for navigation and additional options.
*/
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PRIMARY_ADMIN_NAV_LINKS, PRIMARY_AUTH_NAV_LINKS, PRIMARY_USER_NAV_LINKS } from "../utils/navigation";
import { useAuth } from "./auth/AuthContext";

import profileIcon from '../assets/Icon.png';

export default function Sidebar() {

    const { user, signOut } = useAuth();
    
    const navigate = useNavigate();
    
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen((v) => !v);
    const closeMenu = () => setMenuOpen(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    }

    return (
        <>
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
                    {
                        !user 
                        ? PRIMARY_AUTH_NAV_LINKS.map(link => (
                                <li key={link.path}
                                    className={(window.location.pathname === link.path || window.location.pathname.startsWith(link.path + '/')) ? "landing-basic__drawer-item landing-basic__drawer-item--active" : "landing-basic__drawer-item"}
                                    aria-current={(window.location.pathname === link.path || window.location.pathname.startsWith(link.path + '/')) ? "page" : undefined}
                                >
                                    <Link to={link.path}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))
                        : <>
                            <li>
                                <img src={typeof user.image === 'string' ? user.image : profileIcon} alt={`${user.username}'s profile`} className="landing-basic__drawer-profile-avatar" />
                            </li>
                            <li>
                                <h2 className="landing-basic__drawer-profile-username">{user.username}</h2>
                            </li>
                            {
                                PRIMARY_USER_NAV_LINKS.map(link => (
                                    <li key={link.path}
                                        className={(window.location.pathname === link.path || window.location.pathname.startsWith(link.path + '/')) ? "landing-basic__drawer-item landing-basic__drawer-item--active" : "landing-basic__drawer-item"}
                                        aria-current={(window.location.pathname === link.path || window.location.pathname.startsWith(link.path + '/')) ? "page" : undefined}
                                    >
                                        <Link to={link.path}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))
                            }
                            {
                                !user?.admin 
                                ? null 
                                : <>
                                    <li>
                                        <h2>Admin</h2>
                                    </li>
                                    {
                                        PRIMARY_ADMIN_NAV_LINKS.map(link => (
                                            <li key={link.path}
                                                className={(window.location.pathname === link.path || window.location.pathname.startsWith(link.path + '/')) ? "landing-basic__drawer-item landing-basic__drawer-item--active" : "landing-basic__drawer-item"}
                                                aria-current={(window.location.pathname === link.path || window.location.pathname.startsWith(link.path + '/')) ? "page" : undefined}
                                            >
                                                <Link to={link.path}>
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))
                                    }
                                </> 
                            }
                            <li>
                                <button type="button" className="primary-button" onClick={handleSignOut}>
                                    Sign Out
                                </button>
                            </li>
                        </>
                    }
                </ul>
            </nav>
        </>
    );
}
