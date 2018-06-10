mapboxgl.accessToken = 'pk.eyJ1Ijoib21hci1uYXZhcnJvIiwiYSI6ImNpanN2ZWZxZzBoa291eWx4ZWdsajl1OGIifQ.SH4OG9811nirTGJ3rE4DHw';

var map = new mapboxgl.Map({
    container: 'map', // container element id
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-74.0059, 40.7128], // initial map center in [lon, lat]
    zoom: 12
});
map.on('load', function() {
    var filterHour = ['==', ['number', ['get', 'Hour']], 12];
    var filterDay = ['!=', ['string', ['get', 'Day']], 'placeholder'];
    map.addLayer({
        id: 'collisions',
        type: 'circle',
        source: {
            type: 'geojson',
            data: 'collisions1601.geojson' // replace this with the url of your own geojson
        },
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'Casualty']],
                0, 4,
                5, 24
            ],
            'circle-color': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'Casualty']],
                0, '#ffffcc',
                1, '#c7e9b4',
                2, '#7fcdbb',
                3, '#41b6c4',
                4, '#2c7fb8',
                5, '#253494'
            ],
            'circle-opacity': 0.8
        }
    }, 'admin-2-boundaries-dispute');
    filter: ['all', filterHour, filterDay]
    document.getElementById('slider').addEventListener('input', function(e) {
        var hour = parseInt(e.target.value);
        // update the map
        filterHour = ['==', ['number', ['get', 'Hour']], hour];
        map.setFilter('collisions', ['all', filterHour, filterDay]);
        // converting 0-23 hour to AMPM format
        var ampm = hour >= 12 ? 'PM' : 'AM';
        var hour12 = hour % 12 ? hour % 12 : 12;

        // update text in the UI
        document.getElementById('active-hour').innerText = hour12 + ampm;
    });
    document.getElementById('filters').addEventListener('change', function(e) {
        var day = e.target.value;
        if (day === 'all') {
            // `null` would not work for combining filters
            filterDay = ['!=', ['string', ['get', 'Day']], 'placeholder'];
        }
        /* the rest of the if statement */
        map.setFilter('collisions', ['all', filterHour, filterDay]);
    });
});
