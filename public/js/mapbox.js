/*eslint-disable*/
console.log('Hellllooooo ');
const mapbox = document.getElementById('map');
if (mapbox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations,
  );
  console.log(locations);

  mapboxgl.accessToken =
    'pk.eyJ1IjoiZWJyYWhpbWFib3VsZmFkbCIsImEiOiJjbG5pY242dmcwMWY2Mnhxbzl5OXk5aDFvIn0.og1qaCUKKEr-CownRaqaWw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ebrahimaboulfadl/clnid51j6043301r79w34e3eo',
    scrollZoom: false,
    //   center: [-118.246216, 34.055903],
    //   zoom: 10,
    //   interactive: false,
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    //add popup
    new mapboxgl.Popup({ offset: 45 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    //extends the map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
}
