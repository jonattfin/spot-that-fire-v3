
import _ from 'lodash';

var center = {
    lat: 46.7658,
    lng: 23.5767
};

export const addressPoints = _.range(0, 90).map(x => {
    var randLat = _.random(-0.5, 0.5);
    var randLng = _.random(-0.5, 0.5);

    var pm = _.random(0, 20);
    var temp = _.random(20, 100);
    var humidity = _.random(20, 100);

    return {
        lat: randLat + center.lat,
        lng: randLng + center.lng,
        pm,
        temp,
        humidity,
        flame: 0
    }
});

