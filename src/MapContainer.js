import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Map, InfoWindow, Marker} from 'google-maps-react';
import * as FoursquareAPI from './FoursquareAPI';

class MapContainer extends Component {
  state = {
    locations: [
      {name: "Edinburgh Castle", position: {lat: 55.9485947, lng: -3.2021022}, showMarker: true},
      {name: "Arthur's Seat", position: {lat: 55.9440817, lng: -3.1705872}, showMarker: true},
      {name: "National Museum of Scotland", position: {lat: 55.9471904, lng: -3.1913566}, showMarker: true},
      {name: "The Real Mary King's Close", position: {lat: 55.9498297, lng: -3.1926443}, showMarker: true},
      {name: "Royal Botanic Garden", position: {lat: 55.9652527, lng: -3.2114196}, showMarker: true}
    ],
    venuePhotoUrl: '',
    venueHours: '',
    activeMarker: {},
    showInfoWindow: false,
    selectedVenue: {},
    query: '',
  }

  // Get venue image url and hour information from the Foursquare API
  selectedVenueInfo = (lat, lng, name) => {
    FoursquareAPI.getVenueDetails(lat, lng, name).then(res => {
      if (res) {
        if (!res.response.venue.hours) {
          this.setState({
            venuePhotoUrl: `${res.response.venue.bestPhoto.prefix}250x150${res.response.venue.bestPhoto.suffix}`,
            venueHours: 'Hours not listed'
          });
        }
        else {
          this.setState({
            venuePhotoUrl: `${res.response.venue.bestPhoto.prefix}250x150${res.response.venue.bestPhoto.suffix}`,
            venueHours: `${res.response.venue.hours.status}`
          });
        }
      }
      else if (!res) {
        this.setState({
          venuePhotoUrl: 'err',
          venueHours: 'Oops! Oops! The hour information failed to load.'
        })
      }
    });
  }

  // Handles when a venue on the list is clicked, the info window pops and the marker bounces
  keyPressInfoWindow = (evt) => {
    evt.key === 'Enter' ? this.clickListInfoWindow(evt) : null
  }

  clickListInfoWindow = (evt) => {
    this.setState({
      venuePhotoUrl: '',
      venueHours: ''
    });
    this.setState({
      selectedVenue: this.refs[evt.target.id].props,
      activeMarker: this.refs[evt.target.id].marker,
      showInfoWindow: true
    });
    this.selectedVenueInfo(this.refs[evt.target.id].props.position.lat, this.refs[evt.target.id].props.position.lng, this.refs[evt.target.id].props.name);
    this.refs[evt.target.id].marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
    setTimeout(this.refs[evt.target.id].marker.setAnimation(null), 750);
  }

  // Handles when a marker is clicked, the info window pops
  onInfoWindow = (venue, marker) => {
    this.setState({
      venuePhotoUrl: '',
      venueHours: ''
    });
    this.setState({
      selectedVenue: venue,
      activeMarker: marker,
      showInfoWindow: true
    });
    this.selectedVenueInfo(venue.position.lat, venue.position.lng, venue.name);
  }

  // Handles when the map or another maker is clicked, the existing info window closes
  offInfoWindow = (map) => {
    if (this.state.showInfoWindow) {
      this.setState({
        showInfoWindow: false,
        activeMarker: null
      });
    }
  }

  // Filter the venue list with input
  updateQueryList = (query) => {
    this.setState({query});
    if (query) {
      this.setState(prevState => ({
        locations: prevState.locations.map(location =>
          location.name.toLowerCase().includes(query.toLowerCase()) ?
            Object.assign(location, {showMarker: true}) : Object.assign(location, {showMarker: false})
        )
      }));
    }
    else if (!query) {
      this.setState(prevState => ({
        locations: prevState.locations.map(location =>
          Object.assign(location, {showMarker: true})
        )
      }));
    }
  }

  checkboxByEnter = (evt) => {
    let checkbox = document.getElementById('menu-toggle');
    evt.key === 'Enter' ? checkbox.checked = !checkbox.checked : null
  }

  render() {
    const {locations, venuePhotoUrl, venueHours, activeMarker, showInfoWindow, selectedVenue, query} = this.state;

    const mapCenter = {
      lat: 55.9485947,
      lng: -3.2021022
    }

    return (
      <div>
        <div id="menu-container">
          <input type="checkbox" tabIndex="0" onKeyPress={this.checkboxByEnter} aria-label="menu" id="menu-toggle" />
          <span id="bars" className="bar1"></span>
          <span id="bars" className="bar2"></span>
          <span id="bars" className="bar3"></span>
          <div id="menu">
            <div id="search-container">
              <input
                id="search-venues"
                type="text"
                placeholder="Venue Name"
                aria-label="Input to filter venues"
                value={query}
                onChange={evt => this.updateQueryList(evt.target.value)}
              />
            </div>
            <ul id="venue-list">
              {locations
                .filter(location => location.showMarker === true)
                .map(location => (
                  <li tabIndex="0" role="menuitem" aria-label={location.name} className="venue" id={location.name} key={location.name} onClick={this.clickListInfoWindow} onKeyPress={this.keyPressInfoWindow}>{location.name}</li>
                ))}
            </ul>
          </div>
        </div>
        <Map
          google={this.props.google}
          onClick={this.offInfoWindow}
          ref={'map'}
          initialCenter={mapCenter}
          zoom={14}>
          {locations
            .filter(location => location.showMarker === true)
            .map(location => (
            <Marker
              onClick={this.onInfoWindow}
              name={location.name}
              key={location.name}
              position={location.position}
              ref={location.name}
               />
          ))}
          <InfoWindow
            marker={activeMarker}
            visible={showInfoWindow}>
              <div tabIndex="0" id="info-window">
                <h3 aria-hidden="true" id="info-name">{selectedVenue.name}</h3>
                {venuePhotoUrl === 'err' ?
                  <p>Oops! The image failed to load.</p> :
                  <img id="info-img" src={venuePhotoUrl} alt={selectedVenue.name} />
                }
                <p id="info-text">{venueHours}</p>
              </div>
          </InfoWindow>
        </Map>
        <p tabIndex="0" id="data-source">Venue information is provided by Foursquare API.</p>
      </div>
    )
  }
}

export default MapContainer;
