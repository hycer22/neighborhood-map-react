const clientID = 'RU2CTUNOYQNE2DAKAM1Y3QAVLJ013IWXTKU4SL20KN2WHHUX';
const clientSecret = '0HSA3L0M5NSIOJBDFRN4XZKEXAICK0ZRW2W031LHT15QZGSY';

const urlForId = (lat, lng, name) =>
  `https://api.foursquare.com/v2/venues/search?ll=${lat},${lng}&query=${name}&limit=1&client_id=${clientID}&client_secret=${clientSecret}&v=20180802`

const urlForDetails = (id) =>
  `https://api.foursquare.com/v2/venues/${id}?&client_id=${clientID}&client_secret=${clientSecret}&v=20180802`

// First get the ID of the venue and then get the detailed information of the venue
export const getVenueDetails = (lat, lng, name) =>
  fetch(urlForId(lat, lng, name))
    .then(res => res.json())
    .then(data => {
      if (data.response.venues[0]) {
        let venueId = data.response.venues[0].id;
        return fetch(urlForDetails(venueId))
          .then(res => res.json())
          .catch(err => console.error(err))
      }
    })
    .catch(err => console.error(err))
