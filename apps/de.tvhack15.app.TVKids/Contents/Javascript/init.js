include("Javascript/Views/MainView.js");
include('Javascript/Views/TheaterRoom.js');

MAF.application.init({
    views: [
        { id: 'view-MainView', viewClass: MainView },
        { id: 'view-Room', viewClass: TheaterRoom },
        { id: 'view-AboutView', viewClass: MAF.views.AboutBox }
    ],
    defaultViewId: 'view-MainView',
    settingsViewId: 'view-AboutView'
});
