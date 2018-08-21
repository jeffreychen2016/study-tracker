import React, { Component } from 'react';
import './App.css';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import fbConnection from '../firebaseRequests/connection';
import Login from '../components/Login/Login';
import MyCategories from '../components/MyCategories/MyCategories';
import firebase from 'firebase';

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
            to={{ pathname: '/MyCategories', state: {from: props.location}}}
          />
        )
      }
    />
  );
};

class App extends Component {
  state = {
    authed: true,
  };
  
  render () {
    if (firebase.apps.length) {
      console.error('Firebase Initialized!');
    };
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <div className="container">
              <div className="row">
                <Switch>
                  <Route path="/" exact component={Login}/>
                  <PrivateRoute
                    path="/mycategories"
                    authed={this.state.authed}
                    component={MyCategories}
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
