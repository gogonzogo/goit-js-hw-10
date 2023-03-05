function flyToCountry(cordinates) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZ29nb256b2dvIiwiYSI6ImNsZXJwMHRoOTAwMXM0MG8xYmptaWIyeTYifQ.8FzWEYUACnNCYkR779gPWg';
// These options control the camera position after animation
  const start = {
    center: [cordinates[0], cordinates[1]],
    zoom: 1,
    pitch: 25
  };
  const end = {
    center: [cordinates[0], cordinates[1]],
    zoom: 6,
    pitch: 40
  };
  const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    ...start
  });

  map.on('style.load', () => {
    // Custom atmosphere styling
    map.setFog({
      'color': 'rgb(220, 159, 159)', // Pink fog / lower atmosphere
      'high-color': 'rgb(36, 92, 223)', // Blue sky / upper atmosphere
      'horizon-blend': 0.4 // Exaggerate atmosphere (default is .1)
    });

    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.terrain-rgb'
    });

    map.setTerrain({
      'source': 'mapbox-dem',
      'exaggeration': 1.5
    });

    const marker = new mapboxgl.Marker({
      color: '#F84C4C',
    })
      .setLngLat([cordinates[0], cordinates[1]])
      .addTo(map);
  });

  let isAtStart = true;

  document.getElementById('fly').addEventListener('click', () => {
    // depending on whether we're currently at point a or b,
    // aim for point a or b
    const target = end;

    map.flyTo({
      ...target, // Fly to the selected target
      duration: 12500, // Animate over 12 seconds
      essential: true // This animation is considered essential with
      //respect to prefers-reduced-motion
    });
  });
}

export { flyToCountry };