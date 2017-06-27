require('angular-ui-bootstrap');
require('angular-animate');
require('angular-scroll');
require('angular-touch');

var app = angular.module('nApp', ['ngAnimate', 'ui.bootstrap', 'duScroll']);
app.controller('landingCtrl', [
    '$scope', '$document', '$interval', 'Util', function ($scope, $document,$interval, Util) {
        $scope.toggleMenu = toggleMenu;
        $scope.isOpenMenu = false;
        $scope.countdown = {"days": "", "hours": "", "minutes":"", "seconds": ""};

        function toggleMenu() {
            console.log('toggle');
            $scope.isOpenMenu = !$scope.isOpenMenu;
        }

        var future;
        future = new Date('Jule 1, 2017 12:00:00');

        $interval(function() {
            var diff;
            diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
            var diffData = Util.dhms(diff);
            $scope.countdown.days = diffData[0];
            $scope.countdown.hours = diffData[1];
            $scope.countdown.minutes = diffData[2];
            $scope.countdown.seconds = diffData[3];

        }, 1000);

    }]).value('duScrollOffset', 140);

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
                return [days, hours, minutes,seconds];
            }
        };
    }
]);