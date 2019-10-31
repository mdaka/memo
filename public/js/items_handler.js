
ipcRenderer.on('onFirstLoad_showNotificationItems', (event, items) => {
    
    var element = document.getElementById("notificationItemsDataElmId");
    
    showNotificationItemsToHtmlView(element, items);
});


function sumOfLiElement(sum, liText){
  
  return sum + '<li>' + liText + '</li>';
}

function showNotificationItemsToHtmlView(element, items) {
  
  let liHtmlItems = items.reduce(sumOfLiElement, '');
  element.innerHTML = liHtmlItems;

}