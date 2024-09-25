const moment = require('moment');

module.exports = function () {
    //let date = moment().isoWeekday(5).format('YYYY-MM-DD');
    let date = moment().isoWeekday(5).format('YYYY-MM-DD');
    
    let startTime = moment(date + ' ' + "12:30").unix();
    let endTime = moment(date + ' ' + "15:30").unix();

    return [startTime, endTime]
}