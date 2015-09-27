function Init () {
    var pusher = new Pusher('e09a4bff1cae85b0ca3c');
    var channel = pusher.subscribe('tv-theater-channel');
    channel.bind('room-ready', function(data) {
        window.roomHash = data.hash;
        window.draw = Draw();
        bindCanvasEvents();
        $('.status').css('background-image','url(\'images/connect_on.png\' )');
    });



    // Draw API
    var Draw = (function (c) {

        var tvScreenWidth = 1920;
        var tvScreenHeigth = 1080;
        var enabled = false,
            room = new MAF.Room(window.roomHash);
        room.hash = window.roomHash;
        room.join(window.roomHash);

        room.addEventListener('joined', function (event) {
            // A client has joined
        });

        window.addEventListener('unload', function (event) {
            room.destroy();
            room = null;
        }, false);

//      notify TV to move picture to mapped position xy
        var moveTo = function (x,y,monster) {
            var newX = x * (tvScreenWidth / $(window).width());
            var newY = y * (tvScreenHeigth / $(window).height());
            room.send({
                x:newX,
                y:newY,
                monster:monster
            });
        };

        return {
            moveTo : moveTo
        }
    });

    function bindCanvasEvents () {
        $('.draggable').draggable({
            containment: "tv-canvas",
            start: function() {
            },
            drag: function(event) {
                var $this = $(this);
                var monsterId = $this.attr('monster-id');
                var thisPos = $this.position();
                var parentPos = $this.parent().position();

                var x = thisPos.left - parentPos.left;
                var y = thisPos.top - parentPos.top;
                window.draw.moveTo(x,y,monsterId);
            },
            stop: function() {
            }
        });
    }

};

window.onload = Init;