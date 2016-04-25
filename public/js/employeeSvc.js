var module = angular.module('employeeSvc', []);

module.service('EmployeeService', ['$http', function ($http) {
	var svc = this;
	svc.saveEmployee = function (employee) {
		if(employee._id == null) {
			return $http.post('/api/employees', employee);
		} else {
			return $http.put('/api/employees/' + employee._id, employee);
		}
	};
	
	(function () {
		var employee = {};
		
		svc.getEditingEmployee = function () {
			return employee;
		};
		
		svc.setEditingEmployee = function (_employee) {
			employee = _employee;
		};
	}());

	svc.getEmployees = function () {
		return $http.get('/api/employees');
	};
	
	svc.getUpcomingBirthdays = function () {
		return $http.get('/api/employees/birthdays');
	};
	
	/**
	 * Formats all the dates in the given employee object
	 * to the date format 'MM/DD/YYYY'
	 */
	svc.formatDates = function (employee) {
		var dateAttrs = ['hireDate', 'orientationDate', 'firstShiftDate',
			'deactivationDate', 'documentation.i9documents.listA.expirationDate',
			'documentation.i9documents.listB.expirationDate',
			'documentation.i9documents.listC.expirationDate',
			'documentation.foodWorkerCard.expirationDate',
			'documentation.mastPermit.expirationDate'];
			
		for(var i = 0; i < dateAttrs.length; i++) {
			var container = employee;
			var attrNameComponents = dateAttrs[i].split('.');
			var j;
			
			for(j = 0; j < attrNameComponents.length - 1; j++) {
				if(container == null) {
					break;
				}
				
				container = container[attrNameComponents[j]];
			}
			
			if(container != null && container[attrNameComponents[j]] != null) {
				container[attrNameComponents[j]] =
					moment(container[attrNameComponents[j]]).format('MM/DD/YYYY');
			}
		}
	};
}]);