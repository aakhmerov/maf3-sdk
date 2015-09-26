var MainView = new MAF.Class({
    ClassName: 'MainView',
    RoomName : 'Theater-Room',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
        this.parent();
        this.room = new MAF.PrivateRoom(this.RoomName);
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
                backgroundImage: 'Images/Welcomescreen.jpg',
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
                    var url = widget.getUrl('Client/theater.html?hash=' + payload.hash);
                    log('room created', payload.hash, url);
                    return;
                case 'onDestroyed':
                    clients = {}; // Reset clients
                    log('room destroyed', payload.hash);
                    return;
                case 'onJoined':
                    // If user is not the app then log the user
                    if (payload.user !== room.user)
                        log('user joined', payload.user);
                    return;
                case 'onHasLeft':
                    // If user is not the app then log the user
                    if (payload.user !== room.user)
                        log('user has left', payload.user);
                    return;
                case 'onData':
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
        }).subscribeTo(view.room,
            ['onConnected', 'onDisconnected', 'onCreated', 'onDestroyed', 'onJoined', 'onHasLeft', 'onData', 'onError']);
        room.join();
    },

    // Reset the Canvas
    reset : function() {

    },

	updateView: function () {

	}
});
