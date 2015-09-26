// Create a class and extended it from the MAF.system.SidebarView
var TheaterRoom = new MAF.Class({
    ClassName: 'TheaterRoom',
    RoomName: 'TheaterRoom',

    Extends: MAF.system.FullscreenView,

    initialize: function () {
        var view = this;
        view.parent();
        // Create a Room across all households
//		view.room = new MAF.Room(view.ClassName);
        // Create a Room for this specific household
//        view.room = MAF.messages.fetch("currentRoom");
        view.room = view.persist.room;

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
        this.monsters = {};
        this.monsters["1"] = new MAF.element.Image ({
            src: 'Images/monster_orange.png',
            styles : {
                vOffset:0
            }
        }).appendTo(view);

        this.monsters["2"] = new MAF.element.Image ({
            src: 'Images/monster_yellow.png',
            styles : {
                vOffset:this.monsters["1"].height
            }
        }).appendTo(view);

        this.monsters["3"] = new MAF.element.Image ({
            src: 'Images/mosnter_green.png',
            styles : {
                vOffset:this.monsters["1"].height + this.monsters["2"].height
            }
        }).appendTo(view);

        log(view.room);
        view.roomListener.subscribeTo(view.room, this.supportedRoomEvents, view);
    },

    handleData : function (event) {
        log(event);
    },

    moveMonster : function (data) {
        var view = this;
        log(view);
        var monster = this.monsters[data.monster];
        log(monster);
    },

    roomListener : function (event) {
        var view = this;
        var room = view.room;
        var payload = event.payload;
        switch (event.type) {
            case 'onData':
                var data = payload.data;
                view.moveMonster(payload.data);
                break;
            default:
                log(event.type, payload);
                break;
        }
    },

    hideView: function () {
        // Reference to the current view
        var view = this;
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
