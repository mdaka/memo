const _fs = require('fs');

function JsonReader (fullFilePath) {
    this.fullFilePath = fullFilePath;
    this.readDataFromFile();
}

// Return data as array contains objects
JsonReader.prototype.getDataAsObjects = function() {
    return this.jsonData;
}

JsonReader.prototype.readDataFromFile = function() {
    
    this.jsonData = JSON.parse(_fs.readFileSync(this.fullFilePath));
}

JsonReader.prototype.loopThroughItems = function() {
    /* this.items.forEach(item => {
        this.msgs.push({
          msg: item.msg,
          icon: imagesPath
        });
  
      }); */
}

module.exports = JsonReader;