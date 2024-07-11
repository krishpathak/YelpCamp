const camp1=JSON.parse(camp)
	mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc2hqcGF0aGFrIiwiYSI6ImNseWVxcml4czA1ZWsyanNkenE3cWNpc2wifQ.WHs3UCFBtiEw9DSnaESGdA';
    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        // camera options properties - https://docs.mapbox.com/help/glossary/camera/
        center:camp1.geometry.coordinates,
        pitch: 0, // pitch in degrees
        bearing: 0, // bearing in degrees
        zoom: 7
    });
    new mapboxgl.Marker().setLngLat(camp1.geometry.coordinates).addTo(map)
    map.addControl(new mapboxgl.NavigationControl());
