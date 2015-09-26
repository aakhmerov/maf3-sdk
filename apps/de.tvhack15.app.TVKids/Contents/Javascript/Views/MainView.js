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

        var grid = view.elements.elementGrid = new MAF.element.Grid ({
            currentCellIndex : 0,
            rows: 1,
            columns: 4,
            styles: {
                width: view.width,
                height: view.height,
                backgroundImage: 'Images/title_tv.png',
                backgroundRepeat: 'none',
                backgroundSize: '100%'
            },

            cellCreator: function () {
                var cell = new MAF.element.GridCell({
                    styles: this.getCellDimensions()
                });

                cell.title = new MAF.element.Text({
                    styles: {
                        width: cell.width,
                        height: cell.height,
                        color: 'white',
                        fontSize: 30,
                        anchorStyle: 'center',
                        wrap: true
                    }
                }).appendTo(cell);

                return cell;
            },
            cellUpdater: function (cell, data) {
                cell.title.setText(data.title);
                if (cell.getCellIndex() === 0) {
                    var backButton = new MAF.control.BackButton({
                        label: $_('BACK'),
                        styles: {
                            width: cell.width,
                            color: 'white',
                            fontSize: 30,
                            anchorStyle: 'center',
                            wrap: true
                        }
                    }).appendTo(cell);
                    var connectionButton = new MAF.element.Image({
                        src : 'Images/Button_Connect.jpg',
                        styles: {
                            color: 'white',
                            fontSize: 30,
                            anchorStyle: 'center',
                            wrap: true,
                            vOffset:backButton.height + 10
                        }
                    }).appendTo(cell);
                }
            }
        }).appendTo(view);

        view.elements.elementGrid.changeDataset([
            {},{},{},{}
        ], true);

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
                    MAF.messages.store("currentRoom", room);

                    MAF.application.loadView('view-Room',{
                        room : room
                    });
                }
                return;
            case 'onData':
                window.Event.call("onData", payload);
                var data = payload.data;
                log(event.payload.data);
                break;
            default:
                log(event.type, payload);
                break;
        }
    },

    hideView: function () {
        // Reference to the current view
        var view = this;
        view.roomListener.unsubscribeFrom(view.room, this.supportedRoomEvents);
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
    },

	updateView: function () {

	}

});
