import React, {Component} from 'react';
import {GoogleApiWrapper} from 'google-maps-react';
import MapContainer from './MapContainer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div id="App">
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBDc6CrwP5MKP8eyNSqMKdMqzbMNShf0_8'
})(App)
