// Create a class and extended it from the MAF.system.SidebarView
var TheaterRoom = new MAF.Class({
    ClassName: 'TheaterRoom',
    RoomName: 'TheaterRoom',

    Extends: MAF.system.FullscreenView,

    initialize: function () {
        var view = this;
        view.parent();
        view.room = view.persist.room;
    },

    // Create your view template
    createView: function () {
        var view = this;
        var grid = view.elements.elementGrid = new MAF.element.Container ({
            styles: {
                width: view.width,
                height: view.height,
                backgroundImage: 'Images/living_room_bg2.png',
                backgroundRepeat: 'none',
                backgroundSize: '100%'
            }
        }).appendTo(view);
        this.monsters = {};
        this.monsters["1"] = new MAF.element.Image ({
            src: 'Images/monster_orange.png'
        }).appendTo(view);

        this.monsters["2"] = new MAF.element.Image ({
            src: 'Images/monster_yellow.png'
        }).appendTo(view);

        this.monsters["3"] = new MAF.element.Image ({
            src: 'Images/mosnter_green.png'
        }).appendTo(view);

        this.monsters["4"] = new MAF.element.Image ({
            src: 'Images/monster_red.png'
        }).appendTo(view);

    },

    updateView : function () {
        var view = this;
        this.registerMessageCenterListenerCallback(this.handleData);
//        align monsters in one row
        var sumx = 0;
        for (var monster in this.monsters) {
            var m = this.monsters[monster];

            m.animate({
                hOffset:sumx,
                duration: 0.3
            });
            sumx = sumx + m.srcWidth + 5;
        }
    },

    handleData : function (event) {
        this.moveMonster(event.payload.value);
    },

    moveMonster : function (data) {
        var view = this;
        var monster = this.monsters[data.monster];
        this.monsters[data.monster].animate({
            hOffset:data.x,
            vOffset:data.y,
            duration: 0.01
        });
    },

    roomListener : function (event) {
        var view = this;
        var room = view.room;
        var payload = event.payload;
        switch (event.type) {
            case 'onData':
                log('got data from user');
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

    supportedRoomEvents: ['onData'],

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
