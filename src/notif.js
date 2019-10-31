const nn = require('node-notifier');

class Notif {

  constructor(jsonData, imagesPath, ctime) {
    this.jsonData = jsonData;
    this.imagesPath = imagesPath;
    this.ctime = ctime;

    this.notifier = nn;
    this.length = jsonData.length;
    this.currentIndex = 0;
    this.msgs = [];
    this.initMsgs();
  }

  getTime() {
    return this.ctime.getCurrentTime();
  }

  initMsgs(){

    // 1. Process json data
    var items = this.jsonData;
    var imagesPath = this.imagesPath;

    items.forEach(item => {

      this.msgs.push({

        msg: item.list,
        icon: imagesPath

      });


    });

  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  incrementIndex(){
    this.currentIndex = this.currentIndex + 1;

    // Reset the index to zero to loop over the notifications again
    if(this.currentIndex === this.length){
      this.currentIndex = 0;
    }
  }

  getNotification(index) {
    return {
      subtitle: void 0,
      msg : this.msgs[index].msg,
      icon : this.msgs[index].icon,
    };
  }

  getBaseOptions() {
    return {
        wait: false,
        title: this.getTime(),
        sound: false, // For mac OS: asso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink
        // contentImage: './public/icon.png',
    };
  }

  displayNextNotification() {
    var index = this.getCurrentIndex();
    var notification = this.getNotification(index);
    this.displayNotification(index, notification);
    this.incrementIndex();
  }


  displayNotification(index, notification) {

    var options = this.getBaseOptions();
    
    if(notification.msg.length > 1){
      options.title =  notification.msg[0];
      options.subtitle =  notification.msg[1];
      options.message =  " ";
      options.icon =  void 0;
    }
    else{
      options.title =  notification.msg[0];
      options.message = " ";
      options.icon =  void 0;
    }
    
    // options.icon =  notification.icon;
    options.contentImage =  notification.icon;
    

    this.notifier.notify(options);
    
    /* Instead you can also use the bottom lines of new NotificationCenter ...*/
    /* new NotificationCenter({
      withFallback: false, // Fallback to Growl or Balloons?
      customPath: void 0 // Relative/Absolute path if you want to use your fork of SnoreToast.exe
    }).notify(options); */
  }


};

module.exports = Notif;


 

