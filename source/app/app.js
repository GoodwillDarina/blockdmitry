require('angular-ui-bootstrap');
require('angular-animate');
require('angular-scroll');
require('angular-touch');

var app = angular.module('nApp', ['ngAnimate', 'ui.bootstrap', 'duScroll']);
app.controller('landingCtrl', [
    '$scope', '$document', function ($scope, $document) {
        $scope.toggleMenu = toggleMenu;
        $scope.isOpenMenu = false;

        function toggleMenu() {
            console.log('toggle');
            $scope.isOpenMenu = !$scope.isOpenMenu;
        }
}]).value('duScrollOffset', 153);

app.directive('countdown', [
    'Util', '$interval', function(Util, $interval) {
        return {
            restrict: 'A',
            scope: {
                date: '@'
            },
            link: function(scope, element) {
                var future;
                future = new Date(scope.date);
                $interval(function() {
                    var diff;
                    diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return element.text(Util.dhms(diff));
                }, 1000);
            }
        };
    }
]);
app.factory('Util', [
    function() {
        return {
            dhms: function(t) {
                var days, hours, minutes, seconds;
                days = Math.floor(t / 86400);
                t -= days * 86400;
                hours = Math.floor(t / 3600) % 24;
                t -= hours * 3600;
                minutes = Math.floor(t / 60) % 60;
                t -= minutes * 60;
                seconds = t % 60;
                return [days + 'd', hours + 'h', minutes + 'm', seconds + 's'].join(' ');
            }
        };
    }
]);