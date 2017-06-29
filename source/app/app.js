require('angular-ui-bootstrap');
require('angular-animate');
require('angular-scroll');
require('angular-touch');

var offsetTop = 125;

var app = angular.module('nApp', ['ngAnimate', 'ui.bootstrap', 'duScroll']);
app.controller('landingCtrl', [
    '$scope', '$window', '$interval', 'Util', function ($scope, $window, $interval, Util) {
        $scope.toggleMenu = toggleMenu;
        $scope.isOpenMenu = false;
        $scope.countdown = {'days': '', 'hours': '', 'minutes':'', 'seconds': ''};

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



    }]).value('duScrollOffset', offsetTop);

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
app.directive('scrollFixed', [function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.element = element[0];
            scope.scrollContent = document.querySelector('.page-main');
            scope.window = window;

            scope.window.onscroll = function() {
                 if (scope.window.pageYOffset > (scope.element.offsetHeight - 20) && !scope.element.classList.contains('is-scroll-hide')) {
                     scope.element.classList.add('is-scroll-hide');
                 } else if (scope.window.pageYOffset <= (scope.element.offsetHeight - 20) && scope.element.classList.contains('is-scroll-hide')) {
                     scope.element.classList.remove('is-scroll-hide');
                 }
            };

        }
    };

}]);


app.directive('sidebarToggle', [function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.element = element[0];
            scope.body = document.body;
            scope.element.addEventListener('click', function() {
                var _element = document.getElementById(attrs.sidebarToggle);
                _element.classList.toggle('sidebar--is-open');
                var _bgSidebar = document.getElementById(attrs.sidebarToggle + '-bg');
                _bgSidebar.classList.toggle('sidebar-bg--is-visible');

                //control body
                if (scope.body.style.overflowY == 'hidden') {
                    scope.body.style.overflowY = 'auto';
                } else {
                    scope.body.style.overflowY = 'hidden';
                }
            });

        }
    };
}]);
app.directive('sidebar', ['$compile', function($compile) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            scope.body = document.body;
            scope.element = element[0];
            //renderize sidebar
            scope.element.style.display = 'block';

            //add width on sidebar
            function isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            if (isNumber(attrs.size)) {
                scope.element.style.maxWidth = attrs.size + 'px';
            } else {
                scope.element.style.maxWidth = attrs.size;
            }

            //add class to position on sidebar
            scope.element.classList.add('sidebar--' + attrs.position);

            //renderize bg-sidebar
            var bgSidebar = document.createElement('div');
            bgSidebar.setAttribute('class', 'sidebar-bg');
            bgSidebar.setAttribute('id', attrs.id + '-bg');
            bgSidebar.setAttribute('sidebar-toggle', attrs.id);
            scope.body.appendChild(bgSidebar);

            $compile(bgSidebar)(scope);
        }
    };
}]);