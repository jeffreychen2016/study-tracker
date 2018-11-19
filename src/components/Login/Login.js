import React from 'react';
import './Login.css';
import authRequests from '../../firebaseRequests/auth';

class Login extends React.Component {
  state = {
    user: {
      email: 'test@test.com',
      password: 'qq123456',
    },
  }

  emailChange = e => {
    const tempUser = { ...this.state.user };
    tempUser.email = e.target.value;
    this.setState({ user: tempUser });
  };

  passwordChange = e => {
    const tempUser = { ...this.state.user };
    tempUser.password = e.target.value;
    this.setState({ user: tempUser });
  };

  loginClickEvent = (e) => {
    e.preventDefault();
    const { user } = this.state;
    authRequests
      .loginUser(user)
      .then(() => {
        this.props.history.push('/mycategories');
      })
      .catch(error => {
        console.error('Error with login', error);
      });
  };

  render () {
    const { user } = this.state;

    return (
      <div className="Login">
        <h2 className="login-logo">Study Tracker</h2>
        <form className="col-sm-4 col-sm-offset-4">
          <div className="form-group">
            <label htmlFor="login-email" className="pull-left">Email address</label>
            <input 
              type="email" 
              className="form-control" 
              id="login-email" 
              placeholder="Email" 
              value={user.email}
              onChange={this.emailChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password"  className="pull-left">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="login-password"
              placeholder="Password" 
              value={user.password}
              onChange={this.passwordChange}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-default"
            onClick={this.loginClickEvent}
          >
          Sign in
          </button>
        </form>
      </div>
    )
  }
}

export default Login;
