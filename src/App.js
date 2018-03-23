import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Upload from './components/Uploader';

class App extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Upload />
      </div>
    );
  }
}

export default App;
