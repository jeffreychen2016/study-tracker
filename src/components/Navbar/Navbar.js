import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import authRequests from '../../firebaseRequests/auth';

class Navbar extends React.Component {
  render () {
    const {authed} = this.props;

    const logoutClickEvent = () => {
      authRequests.logoutUser();
    };

    return (
      <div className="Navbar">
        <nav className="navbar">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              {
                authed ? (
                  <ul className="nav navbar-nav navbar-right">
                    <li>
                      <Link to="/mycategories">Study Log</Link>
                    </li>
                    <li>
                      <Link to="/timeclock">Time Clcok</Link>
                    </li>
                    <li className="navbar-form">
                      <button
                        className="btn btn-danger"
                        onClick={logoutClickEvent}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                ) : (
                  <ul className="nav navbar-nav navbar-right">
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                  </ul>
                )
              }
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default Navbar;
