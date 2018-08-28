import React, { Component } from 'react';
import './App.css';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import fbConnection from '../firebaseRequests/connection';
import firebase from 'firebase';
import Login from '../components/Login/Login';
import MyCategories from '../components/MyCategories/MyCategories';
import Navbar from '../components/Navbar/Navbar';
import StudyLogs from '../components/StudyLogs/StudyLogs';
import TimeClock from '../components/TimeClock/TimeClock';

fbConnection();
const PrivateRoute = ({ component: Component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: {from: props.location}}}
          />
        )
      }
    />
  );
};

const PublicRoute = ({ component: Component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/timeclock', state: {from: props.location}}}
          />
        )
      }
    />
  );
};

class App extends Component {
  state = {
    authed: false,
  };

  componentDidMount () {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({authed: true});
      } else {
        this.setState({authed: false});
      };  
    });
  };

  componentWillUnmount () {
    this.removeListener();
  }

  render () {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Navbar
              authed={this.state.authed}
            />
            <div className="container">
              <div className="row">
                <Switch>
                  <Route path="/" exact component={Login}/>
                  <PrivateRoute
                    path="/mycategories"
                    authed={this.state.authed}
                    component={MyCategories}
                  />
                  <PrivateRoute
                    path="/categories/:categoryid/studylogs"
                    authed={this.state.authed}
                    component={StudyLogs}
                  />
                  <PrivateRoute
                    path="/timeclock"
                    authed={this.state.authed}
                    component={TimeClock}
                  />
                  <PublicRoute
                    path="/login"
                    authed={this.state.authed}
                    component={Login}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
