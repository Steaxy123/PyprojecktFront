import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXhwdWNrIiwiYSI6ImNseHZtdnprZDA3eWwya3NhZTZqNDloY3IifQ.0hmlmT5fJz-uluXPElkbvA';

const HamburgMap = () => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [10.002, 53.509], // Wilhelmsburg coordinates
            zoom: 11,
        });

        // Create a DOM element for the marker
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
            <svg width="30" height="40" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M192 0C86 0 0 86 0 192c0 77.4 27.5 99.1 172.5 308.1a24 24 0 0 0 39 0C356.5 291.1 384 269.4 384 192 384 86 298 0 192 0zM192 272a80 80 0 1 1 80-80 80.1 80.1 0 0 1-80 80z" fill="#ff0000"/>
            </svg>
        `;
        markerElement.style.width = '30px';
        markerElement.style.height = '40px';

        // Add marker to the map
        new mapboxgl.Marker(markerElement)
            .setLngLat([10.005, 53.517]) // Coordinates for Wilhelmsburg
            .addTo(map);

        return () => map.remove();
    }, []);

    return (
        <div>
            <div ref={mapContainerRef} style={{ width: '100%', height: '350px' }} />
        </div>
    );
};

export default HamburgMap;
