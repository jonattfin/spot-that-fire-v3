import React, { useEffect, useState } from 'react'
import { Map, TileLayer } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import _ from 'lodash';

import 'leaflet/dist/leaflet.css';
import { addressPoints } from './realworld';

export default function HeatMap() {
    const [points, setPoints] = useState(addressPoints);

    useEffect(() => {
        fetch('https://api.opensensemap.org/boxes/5f733f12821102001b8ad0c1')
            .then(response => response.json())
            .then(data => {
                let { currentLocation, sensors } = data;
                let [lng, lat] = currentLocation.coordinates;

                let value = 0;
                let currentSensors = sensors.filter(s => s.title === "PM10");
                if (currentSensors.length > 0) {
                    value = parseInt(currentSensors[0].lastMeasurement.value, 10) * 100 ;
                }

                var points = [...addressPoints];
                _.range(0, 10).forEach(() => {
                    var randLat = _.random(-0.1, 0.1);
                    var randLng = _.random(-0.1, 0.1);

                    let p = [lat + randLat, lng + randLng, value];
                    points.push(p);
                })
                
                setPoints(points);
            });
    }, []);

    return (
        <Map center={[46.770439, 23.591423]} zoom={13} style={{ height: '100vh', width: '100vw' }}>
            <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={points}
                longitudeExtractor={m => m[1]}
                latitudeExtractor={m => m[0]}
                intensityExtractor={m => parseFloat(m[2])} />
            <TileLayer
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
        </Map>
    )
}