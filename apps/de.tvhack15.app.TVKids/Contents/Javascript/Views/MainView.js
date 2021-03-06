var MainView = new MAF.Class({
    ClassName: 'MainView',
    RoomName : 'TheaterRoom',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
        this.parent();
        var view = this;
        view.room = new MAF.PrivateRoom(this.RoomName);
    },

	createView: function () {
        var view = this;

        var container = new MAF.element.Container({
            styles: {
                width: view.width,
                height: view.height,
                backgroundImage: 'Images/title_tv_bg.png',
                backgroundRepeat: 'none',
                backgroundSize: '100%'
            }

        }).appendTo(view);

        var backButton = new MAF.control.BackButton({
            styles: {
                width: 204,
                height: 82,
                backgroundImage: 'Images/close.png',
                backgroundRepeat: 'none',
                backgroundSize: '100%',
                hOffset : 40,
                vOffset : 950
            }
        }).appendTo(container);

        var connectImage = new MAF.element.Image({
            src: 'Images/connect_off.png',
            styles: {
                width: 335,
                height: 121,
                backgroundRepeat: 'none',
                backgroundSize: '100%',
                hOffset : 40,
                vOffset : 750
            }
        }).appendTo(container);

        this.initRoom();
    },

    initRoom : function (view) {
        var view = this;
        // Set listeners for Room and Connection
        var room = view.room;

        view.roomListener.subscribeTo(view.room, this.supportedRoomEvents, view);
        room.join();
    },

    roomListener : function (event) {
        var view = this;
        var room = view.room;
        var payload = event.payload;
        switch (event.type) {
            case 'onCreated':
                // Create an url to the client application and pass the hash as querystring
                var url = widget.getUrl('Client/theater.html?hash=' + payload.hash);
//                  send request to backend so that it notifies client about hash code
                new Request({
                    url: 'http://localhost:8080/notifications/tv',
                    method: 'POST', //Anything but GET
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {hash: payload.hash}
                }).send();
//                    var triggered = room.channel.trigger('room-ready', { hash: payload.hash });
                log('room created', payload.hash, url);
                return;
            case 'onJoined':
                // If user is not the app then log the user
                if (payload.user !== room.user) {
                    setTimeout(function(){
                        MAF.application.loadView('view-Room',{
                            room : room
                        });
                    }, 3000);

                }
                return;
            case 'onData':
                var data = payload.data;
                MAF.messages.store('monsterMove', payload.data);
                break;
            default:
                log(event.type, payload);
                break;
        }
    },

    hideView: function () {
        // Reference to the current view
        var view = this;
//        view.roomListener.unsubscribeFrom(view.room, this.supportedRoomEvents);
    },

    supportedRoomEvents: ['onCreated', 'onJoined','onData'],

    // Reset the Canvas
    reset : function() {

    },

    destroyView: function () {
        var view = this;
        if (view.room) {
            view.room.leave(); // Leave room, will trigger an onLeaved of the app user
            view.room.destroy(); // Destroy the room
            delete view.room; // Unreference from view for GC
        }
    },

	updateView: function () {

	}

});
