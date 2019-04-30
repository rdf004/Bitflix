import React from 'react';

const NavBar = props => (
    <div className="navbar">
        <ul className="navbar-ul">
            <li className="navbar-li">
                <a className="navbar-a" href="/">Bitflix</a>
            </li>
            <li className="navbar-li">
                <a className="navbar-a" href="/">Account</a>
            </li>
            <li className="navbar-li">
                <a className="navbar-a" href="/">Search</a>
            </li>
        </ul>
    </div>
)

export default NavBar;