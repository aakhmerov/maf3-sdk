include("Javascript/Views/MainView.js");

MAF.application.init({
    views: [
        { id: 'view-MainView', viewClass: MainView },
        { id: 'view-AboutView', viewClass: MAF.views.AboutBox }
    ],
    defaultViewId: 'view-MainView',
    settingsViewId: 'view-AboutView'
});
