import React from 'react';

const NavBar = props => (
    <div className="navbar">
        <ul className="navbar-ul">

            <li className="navbar-li">
                <a className="navbar-a" href="/">Home</a>
            </li>
            <li className="navbar-li">
                <a className="navbar-a" href="/">Movies</a>
            </li>
            <li className="navbar-li">
                <a className="navbar-a" href="/">Profile</a>
            </li>

        </ul>
    </div>
)

export default NavBar;