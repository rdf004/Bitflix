import React from 'react';
import PropTypes from 'prop-types';

const Login = (props) => (
    <div className="login-div-page">
        <div className="login-div">
            <h2 class="login-title">Login</h2>
            <p class="login-p">Log into Bitflix with Facebook to manage your movie votes. Don't let bandwidth limitations limit your entertainment.</p>
            <button className="facebook" onClick={()=>props.authenticate('Facebook')}>
                Log in with Facebook
            </button>
        </div>
    </div>
);

// No this for stateless function
Login.propTypes = {
    authenticate: PropTypes.func.isRequired
};

export default Login;