const _path = require('path');

const Notif = require('./notif');
const CTime = require('./ctime');
const Storage = require('./storage');
const JsonReader = require('./json_reader');


var process;


function playNotifications(notifier, minutesPeriod){
    var mseconds = minutesPeriod * 60000;
    //mseconds = 40000;

    // Display at the first run
    notifier.displayNextNotification();

    process = setInterval(function() {

        notifier.displayNextNotification();

    }, mseconds);
}


class NotifProcess {

    constructor(jsonDataFullPath) {
        this.jsonDataFullPath = jsonDataFullPath;
        this.init();
    }

    init() {
        
        this.jsonReader = new JsonReader(this.jsonDataFullPath);
        this.jsonObjects =  this.jsonReader.getDataAsObjects();
        

        this.imagesPath =  _path.join('public', 'althakron.png');
        this.ctime = new CTime();
        this.notifier = new Notif(this.jsonObjects, this.imagesPath, this.ctime);

        this.storage = new Storage();
        this.minutesPeriod = this.storage.getMinutesPeriod();
        this.onOffStatus = this.storage.getOnOffStatus();

        this.notifications = this.extractNotifcationsFromJsonData();
    }

    extractNotifcationsFromJsonData() {
        let items = [];

        this.jsonObjects.forEach(function(element) {
            items.push(element.list.join( "<br />" ));
        });
        
        return items;
    }

    play() {
        
        if(this.onOffStatus === 1){
            playNotifications(this.notifier, this.minutesPeriod);
        }
        // Kill the current process to stop playing notifications, we need to save the last notification that has been played already in order to continue from there
        else {

            // console.log('clearing process to disable showing notification, process', process);
            clearInterval(process);
        }
    }

    getOnOffStatus() {
        return this.storage.getOnOffStatus();
    }


    // Update notifier period at local file storage and kill the old process and create new notifier to play with different period of time
    updateNotifPeriod(minutesPeriod) {
        
        this.setMinutesPeriod(minutesPeriod);
        clearInterval(process);

        // Play with new different time
        playNotifications(this.notifier, minutesPeriod);

        return true;
    }


    updateOnOffStatus(statusNumber){
        const status = this.storage.setOnOffStatus(statusNumber);
        this.onOffStatus = this.storage.getOnOffStatus();

        this.play();

        return status;
    }

    getNotifications() {
        return this.notifications;
    }

    getMinutesPeriodValue() {
        return this.minutesPeriod;
    }

    setMinutesPeriod(minutesPeriod) {
        this.storage.setMinutesPeriod(minutesPeriod);
        this.minutesPeriod = minutesPeriod;
    }
}



module.exports = NotifProcess;