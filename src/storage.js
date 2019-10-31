const Store = require('electron-store');
const schema = {
    minutesPeriod: {
        type: 'number',
        default:1,
        minimum:1
    },
    onOffStatus: {
        type: 'number',
        default:1,
        minimum:0,
        maximum:1
    }
};

// The following code will print the path where the json data is saved like minutes Period and onOffStatus to a file called "config.json" in mac OS
// console.log(app.getPath('userData'));

class Storage extends Store {

    constructor() {
        super({schema});
        this._schema = schema;
        this.minutesPeriod = this.get('minutesPeriod'); // Read from storage file
        this.onOffStatus = this.get('onOffStatus');
    }

    setMinutesPeriod(minutesPeriod) {
        this.set('minutesPeriod', minutesPeriod); // Using method of extended class "Store"
    }

    setOnOffStatus(statusNumber) {
        
        this.set('onOffStatus', statusNumber);
        this.onOffStatus = statusNumber;

        return true;
    }

    getOnOffStatus() {
        return this.onOffStatus;
    }

    getOnOffStatusFromFile(){
        this.onOffStatus =  this.get('onOffStatus');
        return this.onOffStatus;
    }

    getMinutesPeriodFromFile(){
        this.minutesPeriod =  this.get('minutesPeriod');
        return this.minutesPeriod;
    }

    getMinutesPeriod(){
        return this.minutesPeriod;
    }

};

module.exports = Storage;