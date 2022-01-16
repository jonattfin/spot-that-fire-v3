import _ from 'lodash';

const sensorsIds = [
    "61d9dec9bfd633001ceec78f",
    "61d9dfb6bfd633001cef335f",
    "61d9e015bfd633001cef5ec6",
    "61d9e1d3bfd633001cf02f7a",
    "61d9e229bfd633001cf056c3"
];

var keysNames = [
    "PM10",
    "PM2.5",
    "Temperature",
    "Humidity",
    "Pressure",
    "Fire-on-off"
];

class Api {
    async fetchData() {

        var requests = sensorsIds.map(sensorId => `https://api.opensensemap.org/boxes/${sensorId}`);

        let data = await Promise.all(requests.map(url => fetch(url)))
        .then(async (res) => {
            return Promise.all(
                res.map(async (data) => await data.json())
            )
        })

        return data.map(item => {
            let { name, currentLocation, sensors } = item;
            let [lng, lat] = currentLocation.coordinates;

            let newItem = {};
            _.forEach(keysNames, keyName => {
                let currentSensors = sensors.filter(s => s.title === keyName);
                let value = -1;
                if (currentSensors.length > 0 && currentSensors[0].lastMeasurement) {
                    value = parseInt(currentSensors[0].lastMeasurement.value, 10);
                }
                newItem[keyName] = value;
            });

            return {
                name,
                lat,
                lng,
                pm10: newItem.PM10,
                pm25: newItem["PM2.5"],
                temperature: newItem.Temperature,
                humidity: newItem.Humidity,
                pressure: newItem.Pressure,
                flame: newItem["Fire-on-off"] > 0 ? newItem["Fire-on-off"] : `${getRandomInt(10, 10000)}`
            }
        })
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default new Api();