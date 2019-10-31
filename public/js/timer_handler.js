
ipcRenderer.on('onFirstLoad_showNotificationTimer', (event, periodMinutesValue) => {
    
    var textElement = document.getElementById("chosenPeriodMinutesElmId");
    var rangeElement = document.getElementById("minutesPeriodRangeElmId");
    
    rangeElement.value = periodMinutesValue;
    textElement.value = periodMinutesValue +  " דקות";

});