import React, { Component } from 'react'
import { Map, TileLayer } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";

import 'leaflet/dist/leaflet.css';
import { addressPoints } from './realworld';

export default class SimpleExample extends Component {
    state = {
        lat: 46.770439,
        lng: 23.591423,
        zoom: 13,
    }

    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <Map center={position} zoom={13} style={{ height: '100vh', width: '100vw' }}>
                <HeatmapLayer
                    fitBoundsOnLoad
                    fitBoundsOnUpdate
                    points={addressPoints}
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
}