var MainView = new MAF.Class({
    ClassName: 'MainView',

	Extends: MAF.system.FullscreenView,

	initialize: function () { this.parent(); },

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
                }
            }
        }).appendTo(view);
//        var background = new MAF.element.Image({
//
//            styles: {
//                width: view.width,
//                height: view.height,
//                fontSize: 60,
//                anchorStyle: 'center',
//                backgroundRepeat: 'none',
//                backgroundSize: '100%'
//                }
//            }).appendTo(view);

        view.elements.elementGrid.changeDataset([
            {},{},{},{}
        ], true)
    },

	updateView: function () {

	}
});
