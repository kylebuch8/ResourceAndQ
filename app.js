(function () {
    'use strict';

    /*global angular, alert*/
    angular.module('MyApp', ['ngResource'])
        .controller('MyCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {
            var urlSunnyVale = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D2502265&format=json';
            var urlApex = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D12769068&format=json';

            function successHandler(dataArray) {
                $scope.tempSunnyVale = dataArray[0].data.query.results.channel.item.condition.temp;
                $scope.locationSunnyVale = dataArray[0].data.query.results.channel.item.title;

                $scope.tempApex = dataArray[1].data.query.results.channel.item.condition.temp;
                $scope.locationApex = dataArray[1].data.query.results.channel.item.title;
            }

            function errorHandler() {
                alert('there was an error');
            }

            function getSunnyValeWeather() {
                return $http.get(urlSunnyVale);
            }

            function getApexWeather() {
                return $http.get(urlApex);
            }

            $q.all([getSunnyValeWeather(), getApexWeather()]).then(successHandler, errorHandler);
        }])

        .controller('SecondCtrl', ['$scope', 'MyFactory', function ($scope, MyFactory) {
            $scope.weather = MyFactory.query();
        }])

        .factory('MyFactory', ['$resource', function ($resource) {
            var urlApex = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D12769068&format=json';

            return $resource(urlApex, {}, {
                query: {
                    isArray: false,
                    transformResponse: function (data) {
                        data = JSON.parse(data);

                        return {
                            temp: data.query.results.channel.item.condition.temp,
                            location: data.query.results.channel.item.title
                        };
                    }
                }
            });
        }]);
}());
