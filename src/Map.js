import React, { useEffect, useState } from 'react'
import { Map, TileLayer } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { Sidebar, Tab } from 'react-leaflet-sidetabs'
import { FiHome, FiChevronRight, FiSettings } from "react-icons/fi";
import { WiFire, WiHumidity, WiThermometer } from "react-icons/wi";
import { IconContext } from "react-icons";

import './App.css';

import _ from 'lodash';

import 'leaflet/dist/leaflet.css';
import { addressPoints } from './realworld';

export default function HeatMap() {
    const [points, setPoints] = useState(addressPoints);
    const [collapsed, setCollapsed] = useState(true);
    const [selected, setSelected] = useState('home');

    useEffect(() => {
        fetch('https://api.opensensemap.org/boxes/5f733f12821102001b8ad0c1')
            .then(response => response.json())
            .then(data => {
                let { currentLocation, sensors } = data;
                let [lng, lat] = currentLocation.coordinates;

                let value = 0;
                let currentSensors = sensors.filter(s => s.title === "PM10");
                if (currentSensors.length > 0) {
                    value = parseInt(currentSensors[0].lastMeasurement.value, 10) * 100;
                }

                var points = [...addressPoints];
                _.range(0, 10).forEach(() => {
                    var randLat = _.random(-0.1, 0.1);
                    var randLng = _.random(-0.1, 0.1);

                    let p = {
                        lat: lat + randLat,
                        lng: lng + randLng,
                        pm: value,
                        temp: 100,
                        humidity: 100,
                    };
                    points.push(p);
                })

                setPoints(points);
            });
    }, []);

    return (
        <div>
            <IconContext.Provider value={{ color: "brown" }}>
                <Sidebar
                    id="sidebar"
                    position="right"
                    collapsed={collapsed}
                    closeIcon={<FiChevronRight />}
                    selected={selected}
                    onOpen={(id) => { setSelected(id); setCollapsed(false); console.log(id) }}
                    onClose={() => { setCollapsed(true); }}
                >
                    <Tab id="home" header="Home" icon={<FiHome />}>
                        <p>No place like home!</p>
                    </Tab>
                    <Tab id="pm" header="What's the particle matter?" icon={<WiFire />}>
                        {renderItems(points, 'pm')}
                    </Tab>
                    <Tab id="temp" header="What's the temperature?" icon={<WiThermometer />}>
                        {renderItems(points, 'temp')}
                    </Tab>
                    <Tab id="humidity" header="What's the humidity?" icon={<WiHumidity />}>
                        {renderItems(points, 'humidity')}
                    </Tab>
                    <Tab id="settings" header="Settings" anchor="bottom" icon={<FiSettings />}>
                        <p>We don't want privacy so much as privacy settings!</p>
                    </Tab>

                </Sidebar>
            </IconContext.Provider>
            <Map center={[46.770439, 23.591423]} zoom={13} style={{ height: '100vh', width: '100vw' }}>
                <HeatmapLayer
                    fitBoundsOnLoad
                    fitBoundsOnUpdate
                    points={toHeatmap(points)}
                    longitudeExtractor={m => m[1]}
                    latitudeExtractor={m => m[0]}
                    intensityExtractor={m => parseFloat(m[2])} />
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </Map>
        </div>
    )
}

function toHeatmap(points) {
    return points.map(p => {
        return [p.lat, p.lng, p.pm];
    })
}

function renderItems(points, key) {
    let orderedPoints = _.orderBy(points, key, 'desc')
    const listRows = orderedPoints.map((p) => {
        return (<tr>
            <td>{p[key]}</td>
            <td>{p.lat}</td>
            <td>{p.lng}</td>
        </tr>)
    });

    return (
        <table className="customers">
            <tr>
                <th>{key}</th>
                <th>lat</th>
                <th>long</th>
            </tr>
            {listRows}
        </table>
    )
}