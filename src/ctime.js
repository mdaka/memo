
function CTime () {
    
    this.time = new Date();
}

CTime.prototype.getH = function() {
    return this.time.getHours();
}

CTime.prototype.getM = function() {
    var minutes = this.time.getMinutes();
    if(minutes < 10) {
        return "0" + minutes;
    }
    return minutes;
}

CTime.prototype.getCurrentTime = function() {
    var h = this.getH();
    var m = this.getM();

    return h + ":" + m;
}

module.exports = CTime;