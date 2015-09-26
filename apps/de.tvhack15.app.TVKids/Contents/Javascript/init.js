include("Javascript/Views/MainView.js");
include('Javascript/Views/Room.js');

MAF.application.init({
    views: [
        { id: 'view-MainView', viewClass: MainView },
        { id: 'view-Room', viewClass: Room },
        { id: 'view-AboutView', viewClass: MAF.views.AboutBox }
    ],
    defaultViewId: 'view-MainView',
    settingsViewId: 'view-AboutView'
});
