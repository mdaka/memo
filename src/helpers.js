function getRandomNotifIndex(len){
    var max = len || 1;

    return Math.floor(Math.random() * max); // from 0 to max
}