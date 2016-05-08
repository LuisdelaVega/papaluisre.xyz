angular.module('stocksapp.services', [])

.factory('encodeURIService', function () {
  var encode = function (string) {
    console.log(string);
    return encodeURIComponent(string).replace(/\"/g, "%22").replace(/\ /g, "%20").replace(/[!'()]/g, escape);
  };

  return {
    encode: encode
  };
})

.factory('dateService', function ($filter) {
  var currentDate = function () {
    var d = new Date();
    var date = $filter('date')(d, 'yyyy-MM-dd');

    return date;
  };

  var oneYearAgoDate = function () {
    var d = new Date();
    d.setDate(d.getDate() - 365);

    var date = $filter('date')(d, 'yyyy-MM-dd');

    return date;
  };

  return {
    currentDate: currentDate,
    oneYearAgoDate: oneYearAgoDate
  };
})

.factory ('stockDataService', function ($q, $http, encodeURIService) {

  var getDetailsData = function (ticker) {
    var deferred = $q.defer();
    var query = 'select * from yahoo.finance.quotes where symbol IN ("'+ ticker +'")';
    var url = 'http://query.yahooapis.com/v1/public/yql?q='+ encodeURIService.encode(query) +'&format=json&env=http://datatables.org/alltables.env';

    console.log(url);

    $http.get(url)
    .success(function (json) {
      var jsonData = json.query.results.quote;

      deferred.resolve(jsonData);
    })
    .error(function (err) {
      console.log("Details data error:", err);

      deferred.reject();
    });

    return deferred.promise;
  };

  var getPriceData = function (ticker) {
    var deferred = $q.defer();
    var url = "http://finance.yahoo.com/webservice/v1/symbols/"+ ticker +"/quote?format=json&view=detail";

    $http.get(url)
    .success(function (json) {
      var jsonData = json.list.resources[0].resource.fields;

      deferred.resolve(jsonData);
    })
    .error(function (err) {
      console.log("Price data error:", err);

      deferred.reject();
    });

    return deferred.promise;
  };

  return {
    getPriceData: getPriceData,
    getDetailsData: getDetailsData
  };
});
