import React, { useEffect, useState } from 'react'
import { Map, TileLayer, withLeaflet, LayersControl } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { Sidebar, Tab } from 'react-leaflet-sidetabs'
import { FiHome, FiChevronRight, FiSettings, FiCloudSnow, FiRefreshCcw } from "react-icons/fi";
import { WiFire, WiHumidity, WiThermometer } from "react-icons/wi";
import { IconContext } from "react-icons";
import ReactLeafletMeasure from 'react-leaflet-measure';
import { GoogleLayer } from 'react-leaflet-google-v2'
import _ from 'lodash';

import './App.css';

import 'leaflet/dist/leaflet.css';
import Api from './realworld';

const MeasureControl = withLeaflet(ReactLeafletMeasure);
const { BaseLayer } = LayersControl;

const key = 'AIzaSyASqQ0o4ifr_b9g6nJMq_BJn5x4b3p85_8';

const terrain = 'TERRAIN';
const road = 'ROADMAP';
const satellite = 'SATELLITE';
const hydrid = 'HYBRID';

const measureOptions = {
    position: 'topleft',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'acres',
    activeColor: '#db4a29',
    completedColor: '#9b2d14'
};

export default function HeatMap() {
    const [points, setPoints] = useState([]);
    const [collapsed, setCollapsed] = useState(true);
    const [selected, setSelected] = useState('home');

    useEffect(() => {
        Refresh();
    }, []);

    async function Refresh() {
        var data = await Api.fetchData();
        setPoints(data);
    }

    return (
        <div>
            <IconContext.Provider value={{ color: "brown" }}>
                <Sidebar
                    id="sidebar"
                    position="right"
                    collapsed={collapsed}
                    closeIcon={<FiChevronRight />}
                    selected={selected}
                    onOpen={(id) => { setSelected(id); setCollapsed(false); if (id === "refresh") { setCollapsed(true); Refresh(); } console.log(id); }}
                    onClose={() => { setCollapsed(true); }}
                >
                    <Tab id="refresh" header="Refresh" icon={<FiRefreshCcw />}>
                    </Tab>
                    <Tab id="pm25" header="Particle matter(Smoke) - PM2.5" icon={<FiCloudSnow />}>
                        {renderItems(points, 'pm25')}
                    </Tab>
                    <Tab id="pm10" header="Particle matter(Smoke) - PM10" icon={<FiCloudSnow />}>
                        {renderItems(points, 'pm10')}
                    </Tab>
                    <Tab id="flame" header="Flame" icon={<WiFire />}>
                        {renderItems(points, 'flame')}
                    </Tab>
                    <Tab id="temp" header="Temperature" icon={<WiThermometer />}>
                        {renderItems(points, 'temperature')}
                    </Tab>
                    <Tab id="humidity" header="Humidity" icon={<WiHumidity />}>
                        {renderItems(points, 'humidity')}
                    </Tab>
                    <Tab id="settings" header="Settings" anchor="bottom" icon={<FiSettings />}>
                        <p>We don't want privacy so much as privacy settings!</p>
                    </Tab>

                </Sidebar>
            </IconContext.Provider>
            <Map center={[46.770439, 23.591423]} zoom={13} style={{ height: '100vh', width: '100vw' }}>
                <MeasureControl {...measureOptions} />
                <LayersControl position='bottomleft'>
                    <HeatmapLayer
                        fitBoundsOnLoad
                        fitBoundsOnUpdate
                        points={toHeatmap(points)}
                        longitudeExtractor={m => m[1]}
                        latitudeExtractor={m => m[0]}
                        intensityExtractor={m => parseFloat(m[2])} />
                    <BaseLayer name='OpenStreetMap.Mapnik'>
                        <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                    </BaseLayer>
                    <BaseLayer checked name='Google Maps Roads'>
                        <GoogleLayer googlekey={key} maptype={road} />
                    </BaseLayer>
                    <BaseLayer name='Google Maps Terrain'>
                        <GoogleLayer googlekey={key} maptype={terrain} />
                    </BaseLayer>
                    <BaseLayer name='Google Maps Satellite'>
                        <GoogleLayer googlekey={key} maptype={satellite} />
                    </BaseLayer>
                    <BaseLayer name='Google Maps Hydrid'>
                        <GoogleLayer googlekey={key} maptype={hydrid} libraries={['geometry', 'places']} />
                    </BaseLayer>
                    <BaseLayer name='Google Maps with Libraries'>
                        <GoogleLayer googlekey={key} maptype={hydrid} libraries={['geometry', 'places']} />
                    </BaseLayer>
                </LayersControl>
                {/* <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                /> */}

            </Map>
        </div>
    )
}

function toHeatmap(points) {
    return points.map(p => {
        return [p.lat, p.lng, p.flame];
    })
}

function renderItems(points, key) {
    let orderedPoints = _.orderBy(points, key, 'desc')
    const listRows = orderedPoints.map((p, index) => {
        return (
            <tr key={`key_${p[key]}_${index}`}>
                <td>{p.name}</td>
                <td>{p[key]}</td>
            </tr>
        )
    });

    return (
        <table className="customers">
            <tr>
                <th>name</th>
                <th>value</th>
            </tr>
            {listRows}
        </table>
    )
}