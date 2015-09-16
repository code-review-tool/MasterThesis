$(document).ready(function(){
    $(document).mousemove(function(getCurrentPos){
        var socket = io.connect();
        var prevMouseX = 0;
        var prevMouseY = 0;

        var intervalID = window.setInterval(function(){
            var xCord = getCurrentPos.pageX;
            var yCord = getCurrentPos.pageY;
            var xPercent = xCord / $( document ).width() * 100;
            var yPercent = yCord / $( document ).height() * 100;

            if (prevMouseX !== xCord || prevMouseY !== yCord) {
                socket.emit('mousePosition', {xPercent : xPercent, yPercent : yPercent});
            }

            prevMouseX = xCord;
            prevMouseY = yCord;
        }, 250);
    });
});
