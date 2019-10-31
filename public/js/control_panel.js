const electron = require('electron');

// Use this IPC (inter process communication) to communicate from this document back over 
// to the electron process that is hosting this browser window
// => So this is what we can use to communicate with other parts of our electron application.
const { ipcRenderer } = electron;
let intStatusOnOff = -1;

document.addEventListener('DOMContentLoaded', function() {
  console.log('dom is loaded');
  document.getElementById("onOffElmId").addEventListener("click", switchOnOff);

});

// Listen to main ipc which send to us the current on off status
ipcRenderer.on('onFirstLoad_currentOnOffStatus', (event, statusNumber) => {
    // If statusNumber === 1 we need to show the "On" button, otherwise show the "Off" button
    
    var self = document.getElementById("onOffElmId");
    intStatusOnOff = statusNumber === 0 ? -1 : 1;
    updateOnOffStatusHtmlView(self);
});


function runSpinner() {
  document.getElementById("spinnerLoaderElmId").style.display = "block";
}

function stopSpinner() {
  document.getElementById("spinnerLoaderElmId").style.display = "none";
}


function holdRangeMovments() {
  runSpinner();
  document.getElementById("minutesPeriodRangeElmId").disabled = true;
}


function freeRangeMovments() {
  stopSpinner();
  document.getElementById("minutesPeriodRangeElmId").disabled = false;
}



function periodHasChanged(event, periodMinutesValue) {
  
  holdRangeMovments();

  setTimeout(function sendEventToIPC() {
      
      var status;
      
      // status = ipcRenderer.send('event_periodChanged', periodMinutesValue);
      status = ipcRenderer.sendSync('event_periodChanged', periodMinutesValue);

      // This method will updated the readonly input text of minutes period just when the data saved successfully into config local file
      if(status){
        document.getElementById("chosenPeriodMinutesElmId").value = periodMinutesValue +  " דקות";
      }

      freeRangeMovments();
  }, 1000);
  
}


function holdProgram(elements) {
  runSpinner();

  elements.forEach(element => {
    element.disabled = true;
  });
}

function continueProgram(elements) {
  stopSpinner();

  elements.forEach(element => {
    element.disabled = false;
  });
}

function updateOnOffStatusHtmlView(self) {
  
  if(intStatusOnOff === 1){
    self.style.background="green";
    self.value="ON";
  }
  else{
    self.style.background="lightcoral";
    self.value="OFF";
  }
  intStatusOnOff = -1 * intStatusOnOff; // swap

}

function switchOnOff() {
  let self = this;
  
  let statusNum = self.value === 'ON' ? 0 : 1; // Notice we are returning zero (when current button is "On") because that's mean we need to swap the value to the opposite which is OFF
  

  var inputsCollection = document.getElementsByTagName('input');
  
  // Convert the inputs html collection to array
  var inputsArray = Array.prototype.slice.call(inputsCollection);
  
  holdProgram(inputsArray);
  const ipcEventStatus = ipcRenderer.sendSync('event_onoffChanged', statusNum);
  
  

  setTimeout(function() {
    
    if(!ipcEventStatus) {
      // Something went wrong, so keep the old ipcEventStatus and log the error and investigate it, show to user the error in order to submit an issue request
      continueProgram(inputsArray);
      return;
    }

    updateOnOffStatusHtmlView(self);
  
    continueProgram(inputsArray);
  }, 1300);

}
