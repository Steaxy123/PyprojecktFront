import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Clock from './clock.jsx';
import axios from 'axios';
import HamburgWetter from "./HamburgWetter.jsx";
import HamburgMap from "./HamburgMap.jsx";
import miquel from "./A695CCC6-D1C6-4AEA-84FE-20E6F3FFDD27_4_5005_c.jpeg";
import ServoToggle from "./ServoToggle.jsx";

function App() {

    const getLampClass = (temperature) => {
        if (temperature > 30) return 'lamp red';
        if (temperature > 25) return 'lamp yellow';
        if (temperature >= 20) return 'lamp green';
        return 'lamp gray';
    };

    const [tempSensor1, setTempSensor1] = useState(null);
    const [tempSensor2, setTempSensor2] = useState(null);
    const [tempSensor3, setTempSensor3] = useState(null);

    const [feuchtigkeitSensor1, setFeuchtigkeitSensor1] = useState(null);
    const [feuchtigkeitSensor2, setFeuchtigkeitSensor2] = useState(null);
    const [feuchtigkeitSensor3, setFeuchtigkeitSensor3] = useState(null);

    const [Luefter, setLuefter] = useState(null);

    const [ServoStellung, setServo] = useState(null);

    const [showModal, setShowModal] = useState(false); // State for Modal
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const iframeRef = useRef(null); // Ref for the iframe element

    useEffect(() => {
        const fetchData = async () => {
            try {
                const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
                const backendUrl = 'http://20.218.140.211:8000';

                const clientIds = ["Sensor_Slave_1", "Sensor_Slave_2", "Lamp_Control_Slave"];
                const clientDataPromises = clientIds.map(id =>
                    axios.get(`${corsAnywhere}${backendUrl}/api/client/${id}`)
                );

                const responses = await Promise.all(clientDataPromises);

                setTempSensor1(responses[0].data.temp);
                setFeuchtigkeitSensor1(responses[0].data.humidity);
                setTempSensor2(responses[1].data.temp);
                setFeuchtigkeitSensor2(responses[1].data.humidity);
                setTempSensor3(responses[2].data.temp);
                setFeuchtigkeitSensor3(responses[2].data.humidity);

                const fanResponse = await axios.get(`${corsAnywhere}${backendUrl}/api/cooling/fan`);
                const pwm = fanResponse.data.speed;
                if (pwm === 0) {
                    setLuefter(0);
                } else if (pwm <= 64) {
                    setLuefter(25)
                } else if (pwm <= 128) {
                    setLuefter(50)
                } else if (pwm <= 192) {
                    setLuefter(75)
                } else if (pwm <= 255) {
                    setLuefter(100)
                }

                const gasResponse = await axios.get(`${corsAnywhere}${backendUrl}/api/cooling/gas`);
                setServo(gasResponse.data.open ? 180 : 0); // Assuming 180 for open and 0 for closed
            } catch (error) {
                console.error('Fehler beim Abrufen der Daten:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000); // Fetch every second

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    useEffect(() => {
        if (showModal && iframeRef.current) {
            const iframe = iframeRef.current;
            iframe.onload = () => {
                const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                const playButton = innerDoc.querySelector('.playControl');
                if (playButton) {
                    playButton.click();
                }
            };
        }
    }, [showModal]);

    const calculateAverageTemperature = (temp1, temp2, temp3) => {
        const sum = temp1 + temp2 + temp3;
        return (sum / 3).toFixed(2);
    };

    const averageTemperature = tempSensor1 !== null && tempSensor2 !== null && tempSensor3 !== null
        ? calculateAverageTemperature(tempSensor1, tempSensor2, tempSensor3)
        : null;

    const calculateAverageFeuchtigkeit = (feucht1, feucht2, feucht3) => {
        const sum = feucht1 + feucht2 + feucht3;
        return (sum / 3).toFixed(2);
    };

    const averageFeuchtigkeit = feuchtigkeitSensor1 !== null && feuchtigkeitSensor2 !== null && feuchtigkeitSensor3 !== null
        ? calculateAverageFeuchtigkeit(feuchtigkeitSensor1, feuchtigkeitSensor2, feuchtigkeitSensor3)
        : null;

    const handleStart = () => {
        setStartTime(Date.now());
        setEndTime(null);
    };

    const handleEnd = () => {
        setEndTime(Date.now());
        setShowModal(true); // Show the modal when ending the ride
    };

    const calculateElapsedTime = () => {
        if (startTime && endTime) {
            const elapsed = (endTime - startTime) / 1000;
            return `${Math.floor(elapsed / 60)} min ${Math.floor(elapsed % 60)} sec`;
        }
        return null;
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="grid-container">
                <div className="Container_1">
                    <h>Temp Sensor 1
                        <span className={getLampClass(tempSensor1)}></span>
                    </h>
                    <p>Aktuelle Temperatur: {tempSensor1 !== null ? `${tempSensor1}°C` : 'Laden...'}</p>
                    <p>Aktuelle Luftfeuchtigkeit: {feuchtigkeitSensor1 !== null ? `${feuchtigkeitSensor1}%` : 'Laden...'}</p>
                </div>

                <div className="Container_2">
                    <h>Temp Sensor 2
                        <span className={getLampClass(tempSensor2)}></span>
                    </h>
                    <p>Aktuelle Temperatur: {tempSensor2 !== null ? `${tempSensor2}°C` : 'Laden...'}</p>
                    <p>Aktuelle Luftfeuchtigkeit: {feuchtigkeitSensor2 !== null ? `${feuchtigkeitSensor2}%` : 'Laden...'}</p>
                </div>

                <div className="Container_3">
                    <h>Temp Sensor 3
                        <span className={getLampClass(tempSensor3)}></span>
                    </h>
                    <p>Aktuelle Temperatur: {tempSensor3 !== null ? `${tempSensor3}°C` : 'Laden...'}</p>
                    <p>Aktuelle Luftfeuchtigkeit: {feuchtigkeitSensor3 !== null ? `${feuchtigkeitSensor3}%` : 'Laden...'}</p>
                </div>

                <div className="Container_4">
                    <h>Lüfter</h>
                    <div className="fan" style={{ animation: Luefter !== null ? `spin ${1 / (Luefter / 100)}s linear infinite` : 'none' }}></div>
                    <p>Momentane Lüfter Geschwindigkeit: {Luefter !== null ? `${Luefter}%` : 'Laden...'}</p>
                </div>

                <div className="Container_5">
                    <ServoToggle />
                </div>

                <div className="Container_7">
                    <h>Durchschnitt Temperatur
                        <span className={getLampClass(averageTemperature)}></span>
                    </h>
                    <p>Temperatur: {averageTemperature !== null ? `${averageTemperature}°C` : 'Laden...'}</p>
                </div>

                <div className="Container_8">
                    <h>Durchschnitt Luftfeuchtigkeit</h>
                    <p>Luftfeuchtigkeit: {averageFeuchtigkeit !== null ? `${averageFeuchtigkeit}%` : 'Laden...'}</p>
                </div>

                <div className="Container_9">
                    <Clock/>
                </div>

                <div className="Container_10">
                    <h>Fahrtzeit</h>
                    <p></p>
                    <button onClick={handleStart}>Start Fahrtzeit</button>
                    <button onClick={handleEnd}>Ende Fahrtzeit</button>
                    {startTime && (
                        <p>Startzeit: {new Date(startTime).toLocaleTimeString()}</p>
                    )}
                    {endTime && (
                        <p>Endzeit: {new Date(endTime).toLocaleTimeString()}</p>
                    )}
                    {calculateElapsedTime() && (
                        <p>Fahrtzeit: {calculateElapsedTime()}</p>
                    )}
                </div>
                <div className="Container_11">
                    <HamburgWetter/>
                </div>
                <div className="Container_12">
                    <HamburgMap/>
                </div>
                <div className="Container_13">
                    <h>Mitarbeiter des Monats</h>
                    <p></p>
                    <img src={miquel} alt="miquel"/>
                </div>
            </div>

            {/* Modal for showing the popup */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <p>Fahrtzeit beendet!</p>
                        <iframe
                            ref={iframeRef}
                            width="100%"
                            height="166"
                            scrolling="no"
                            frameBorder="no"
                            allow="autoplay"
                            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/182824938&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
                        ></iframe>
                        <div style={{fontSize: '10px', color: '#cccccc', lineBreak: 'anywhere', wordBreak: 'normal', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif', fontWeight: 100}}>
                            <a href="https://soundcloud.com/patricioignacio" title="Patricio Ignacio" target="_blank" style={{color: '#cccccc', textDecoration: 'none'}}>Patricio Ignacio</a> · <a href="https://soundcloud.com/patricioignacio/pista-13" title="Jarabe tapatío" target="_blank" style={{color: '#cccccc', textDecoration: 'none'}}>Jarabe tapatío</a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
