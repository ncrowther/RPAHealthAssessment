import React, { Component } from 'react';

import logo from './focuscorp.png';

import './index.css';

class App extends Component {
  state = {
    post: '',
    bloodPressure: '',
    weight: '',
    height: '',
    bmi: '',
    gender: '',
    smoker: '',
    exercise: ''
  };

  componentDidMount() {
  }

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/healthdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post })
    });
    const body = await response.json();

    console.log(body);
    this.setState({ bloodPressure: body.bloodPressure});
    this.setState({ weight: body.weight});
    this.setState({ height: body.height});
    this.setState({ bmi: body.bmi});
    this.setState({ gender: body.gender});
    this.setState({ smoker: body.smoker});
    this.setState({ exercise: body.exercise});
  };

render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Enter Patient Id:</strong>
          </p>
          <input
            type="text"
            id="patientId"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit" id="submit">Submit</button>
        </form>
        <h2>
        {this.state.bloodPressure}
        </h2>
        <h2>
        {this.state.weight}
        </h2>
        <h2>
        {this.state.height}
        </h2>
        <h2>
        {this.state.bmi}
        </h2>
        <h2>
        {this.state.gender}
        </h2>
        <h2>
        {this.state.smoker}
        </h2>
        <h2>
        {this.state.exercise}
        </h2>
      </div>
    );
  }
}

export default App;
