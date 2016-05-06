// angular.module is a global place for creating, registering and retrieving Angular modules
// 'stocksapp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'stocksapp.controllers' is found in controllers.js
angular.module('stocksapp',
  [
    'ionic',
    'stocksapp.controllers',
    'stocksapp.services',
    'stocksapp.filters',
    'stocksapp.directives'
  ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true, // Means you cant navigate to this state directly (good for sidebars)
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  // These are children of the app state and can access the code on the AppCtrl object. That's why they don't need their own controller
  // The name is the giveaway ie., app.blah
    .state('app.myStocks', {
      url: '/my-stocks',
      views: {
        'menuContent': {
          templateUrl: 'templates/my-stocks.html',
          controller: 'MyStocksCtrl'
        }
      }
    })

  .state('app.stock', {
    url: '/:stockTicker',
    views: {
      'menuContent': {
        templateUrl: 'templates/stock.html',
        controller: 'StockCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/my-stocks');
});
