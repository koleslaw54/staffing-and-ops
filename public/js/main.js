var staffingApp = angular.module('staffingApp', ['ngRoute', 'directives', 'employeeSvc']);

staffingApp.config(function($routeProvider) {
	$routeProvider
		.when('/employeeContactInfo', {
			templateUrl : 'employeeContactInfo.html',
			controller : 'EmployeeController'
		})
		.when('/employeeForm', {
			templateUrl : 'employeeForm.html',
			controller : 'EmployeeController'
		})
		.when('/employees', {
			templateUrl : 'employeeDashboard.html',
			controller : 'EmployeeController'
		});
});

staffingApp.controller('EmployeeController', ['$scope', '$window', 'EmployeeService', function($scope, $window, EmployeeSvc) {
	$scope.sortField = 'lastName';
	$scope.sortReverse = false;
	
	$scope.sort = function (newSortField) {
		if($scope.sortField === newSortField) {
			$scope.sortReverse = !$scope.sortReverse;
		} else {
			$scope.sortReverse = false;
		}
		
		$scope.sortField = newSortField
	}
	
	$scope.employee = EmployeeSvc.getEditingEmployee();
	$scope.filteredEmployees = [];
	$scope.employees = [];
	EmployeeSvc.getEmployees().then(function (employees) {
		$scope.employees = employees.data;
		
		for(var i = 0; i < $scope.employees.length; i++) {
			EmployeeSvc.formatDates($scope.employees[i]);
		}
	}, function (errorMsg) {
		console.error(errorMsg);
	});
	
	$scope.upcomingBirthdays = [];
	EmployeeSvc.getUpcomingBirthdays().then(function (birthdays) {
		$scope.upcomingBirthdays = birthdays.data;
		var today = new Date();
		var startOfToday = moment().startOf('day');
		
		for(var i = 0; i < $scope.upcomingBirthdays.length; i++) {
			var b = $scope.upcomingBirthdays[i];
			
			if(b.dob.month == 1 && today.getMonth() == 11) {
				b.daysLeft = moment(new Date(today.getFullYear() + 1 + "/" + b.dob.month + "/" + b.dob.day)).diff(startOfToday, 'days');
			} else {
				b.daysLeft = moment(new Date(today.getFullYear() + "/" + b.dob.month + "/" + b.dob.day)).diff(startOfToday, 'days');
			}
		}
	});
	
	function doObjectFieldsContainSearchTerm(obj, fields, searchTerm) {
		var retVal = false;
		for(var i = 0; i < fields.length && !retVal; i++) {
			if(typeof obj[fields[i]] == "string") {
				retVal |= obj[fields[i]].toLowerCase().indexOf(searchTerm) >= 0;
			} else {
				var subObj = obj[fields[i]];
				retVal |= doObjectFieldsContainSearchTerm(subObj, Object.keys(subObj), searchTerm);
			}
		}
		
		return retVal
	}
	
	$scope.getFilter = function (searchTerm, fields) {
		searchTerm = (searchTerm || "").toLowerCase();
		return function (emp) {
			return doObjectFieldsContainSearchTerm(emp, fields, searchTerm);
		}
	};
	
	$scope.cancelEdit = function () {
		EmployeeSvc.setEditingEmployee({});
		$window.location.href = "#/employeeContactInfo";
	};
	

	$scope.edit = function (employeeId) {
		$scope.employee = {};
	
		for(var i = 0; i < $scope.employees.length; i++) {
			if($scope.employees[i]._id === employeeId) {
				$scope.employee = jQuery.extend(true, {}, $scope.employees[i]);
				break;
			}
		}
	
		EmployeeSvc.setEditingEmployee($scope.employee);
		$window.location.href = "#/employeeForm";
	};

	$scope.save = function () {
		EmployeeSvc.saveEmployee($scope.employee);
		$scope.cancelEdit();
	};
	
	$scope.dayChoices = [];
	for(var i = 1; i <= 31; i++) { $scope.dayChoices.push(i); }

	$scope.monthChoices = [
		{ number : 1, name : "January" },
		{ number : 2, name : "February" },
		{ number : 3, name : "March" },
		{ number : 4, name : "April" },
		{ number : 5, name : "May" },
		{ number : 6, name : "June" },
		{ number : 7, name : "July" },
		{ number : 8, name : "August" },
		{ number : 9, name : "September" },
		{ number : 10, name : "October" },
		{ number : 11, name : "November" },
		{ number : 12, name : "December" }
	];
	
	$scope.stateChoices = [
		{ abbreviation:'AL', name:'Alabama' },
		{ abbreviation:'AK', name:'Alaska' },
		{ abbreviation:'AZ', name:'Arizona' },
		{ abbreviation:'AR', name:'Arkansas' },
		{ abbreviation:'CA', name:'California' },
		{ abbreviation:'CO', name:'Colorado' },
		{ abbreviation:'CT', name:'Connecticut' },
		{ abbreviation:'DE', name:'Delaware' },
		{ abbreviation:'FL', name:'Florida' },
		{ abbreviation:'GA', name:'Georgia' },
		{ abbreviation:'HI', name:'Hawaii' },
		{ abbreviation:'ID', name:'Idaho' },
		{ abbreviation:'IL', name:'Illinois' },
		{ abbreviation:'IN', name:'Indiana' },
		{ abbreviation:'IO', name:'Iowa' },
		{ abbreviation:'KS', name:'Kansas' },
		{ abbreviation:'KY', name:'Kentucky' },
		{ abbreviation:'LA', name:'Louisiana' },
		{ abbreviation:'ME', name:'Maine' },
		{ abbreviation:'MD', name:'Maryland' },
		{ abbreviation:'MA', name:'Massachusetts' },
		{ abbreviation:'MI', name:'Michigan' },
		{ abbreviation:'MN', name:'Minnesota' },
		{ abbreviation:'MS', name:'Mississippi' },
		{ abbreviation:'MO', name:'Missouri' },
		{ abbreviation:'MT', name:'Montana' },
		{ abbreviation:'NE', name:'Nebraska' },
		{ abbreviation:'NV', name:'Nevada' },
		{ abbreviation:'NH', name:'New Hampshire' },
		{ abbreviation:'NJ', name:'New Jersey' },
		{ abbreviation:'NM', name:'New Mexico' },
		{ abbreviation:'NY', name:'New York' },
		{ abbreviation:'NC', name:'North Carolina' },
		{ abbreviation:'ND', name:'North Dakota' },
		{ abbreviation:'OH', name:'Ohio' },
		{ abbreviation:'OK', name:'Oklahoma' },
		{ abbreviation:'OR', name:'Oregon' },
		{ abbreviation:'PA', name:'Pennsylvania' },
		{ abbreviation:'RI', name:'Rhode Island' },
		{ abbreviation:'SC', name:'South Carolina' },
		{ abbreviation:'SD', name:'South Dakota' },
		{ abbreviation:'TN', name:'Tennessee' },
		{ abbreviation:'TX', name:'Texas' },
		{ abbreviation:'UT', name:'Utah' },
		{ abbreviation:'VT', name:'Vermont' },
		{ abbreviation:'VA', name:'Virginia' },
		{ abbreviation:'WA', name:'Washington' },
		{ abbreviation:'WV', name:'West Virginia' },
		{ abbreviation:'WI', name:'Wisconsin' },
		{ abbreviation:'WY', name:'Wyoming' }
	];

	$scope.sizes = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];
}]);