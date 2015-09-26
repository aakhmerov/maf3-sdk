var MainView = new MAF.Class({ ClassName: 'MainView',

	Extends: MAF.system.SidebarView,

	initialize: function () { this.parent(); },

	createView: function () {
        var view = this;
        new MAF.element.Text({
            label: $_('Hello World!'),
            styles: {
                width: view.width,
                height: view.height,
                fontSize: 60,
                anchorStyle: 'center'
                }
            }).appendTo(view);
    },

	updateView: function () {

	}
});
