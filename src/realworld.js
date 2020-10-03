
import _ from 'lodash';

var center = {
    lat: 46.7658,
    lng: 23.5767
};

export const addressPoints = _.range(1, 200).map(x => {
    var randLat = _.random(-0.5, 0.5);
    var randLng = _.random(-0.5, 0.5);

    var randValue = _.random(0, 5000);

    return [randLat + center.lat, randLng + center.lng, randValue];
});
