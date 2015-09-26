// Create a class and extended it from the MAF.system.SidebarView
var TheaterRoom = new MAF.Class({
    ClassName: 'TheaterRoom',

    Extends: MAF.system.FullscreenView,

    initialize: function () {
        var view = this;
        view.parent();
        // Create a Room across all households
//		view.room = new MAF.Room(view.ClassName);
        // Create a Room for this specific household
        view.room = MAF.messages.fetch("currentRoom");
    },

    // Create your view template
    createView: function () {
        var view = this;
        var grid = view.elements.elementGrid = new MAF.element.Container ({
            styles: {
                width: view.width,
                height: view.height,
                backgroundImage: 'Images/title_tv.png',
                backgroundRepeat: 'none',
                backgroundSize: '100%'
            }
        }).appendTo(view);
        this.initRoom(view);
    },

    initRoom : function (view) {
        // Set listeners for Room and Connection
        var room = view.room;
        (function (event) {
            var payload = event.payload;
            switch (event.type) {
                case 'onConnected':
                    log('room connected');
                    // If connected but room not joined make sure to join it automaticly
                    if (!room.joined) room.join();
                    return;
                case 'onDisconnected':
                    clients = {}; // Reset clients
                    log('connection lost waiting for reconnect and automaticly rejoin');
                    return;
                case 'onCreated':
                    // Create an url to the client application and pass the hash as querystring
//                    var triggered = room.channel.trigger('room-ready', { hash: payload.hash });
                    log('room created', payload.hash, url);
                    return;
                case 'onDestroyed':
                    clients = {}; // Reset clients
                    log('room destroyed', payload.hash);
                    return;
                case 'onJoined':
                    // If user is not the app then log the user
                    log ('joined user');
                    return;
                case 'onHasLeft':
                    // If user is not the app then log the user
                    if (payload.user !== room.user)
                        log('user has left', payload.user);
                    return;
                case 'onData':
                    log('GOT DATA FROM USER!');
                    var data = payload.data;
                    if (data.e === 'draw')
                        return;
                    if (data.e === 'clear')
                        return this.reset();
                    break;
                default:
                    log(event.type, payload);
                    break;
            }
        }).subscribeTo(view.room, this.supportedRoomEvents);
        room.join();
    },

    hideView: function () {
        // Reference to the current view
        var view = this;
        MainView.unsubscribeFrom(view.room, this.supportedRoomEvents);
    },

    supportedRoomEvents: ['onConnected', 'onDisconnected', 'onCreated', 'onDestroyed', 'onJoined', 'onHasLeft', 'onData', 'onError'],

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
    }
});
