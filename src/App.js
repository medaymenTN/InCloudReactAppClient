import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Login from './Login/Login'
import TimeTracker from './TimeTracker/TimeTracker'
class App extends Component {


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" width="100px" />
          <p>
            Welcome to React time tracker app
          </p>
        </header>
        <div align="center">
          <Router>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/TimeTracker" component={TimeTracker} />
            </Switch>
          </Router>
        </div>

      </div>
    );
  }
}

export default App;
