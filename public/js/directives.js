var module = angular.module('directives', []);

module.directive('header', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "/js/directives/header.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // No custom logic right now
        }]
    };
});

module.directive('employeeNav', function () {
	return {
        restrict: 'A',
        replace: true,
        templateUrl: "/js/directives/employeeNav.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // No custom logic right now
        }]
    };
});