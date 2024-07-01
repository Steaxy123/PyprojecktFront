import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServoToggle.css';

const ServoToggle = () => {
    const [servoOn, setServoOn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gasResponse = await axios.get('http://20.218.140.211:8000/api/cooling/gas');
                setServoOn(gasResponse.data.open);
            } catch (error) {
                console.error('Fehler beim Abrufen der Daten:', error);
            }
        };

        fetchData();

        // Refresh data every second
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    return (
        <div className="toggle-container">
            <h>Servomotor</h>
            <div className={`toggle ${servoOn ? 'toggle-on' : 'toggle-off'}`}>
                {servoOn ? 'An' : 'Aus'}
            </div>
        </div>
    );
};

export default ServoToggle;
