var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017');

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// data models ====================================================================

var Employee = mongoose.model('Employee', {
	firstName : String,
	lastName : String,
	dob : {
		day : Number,
		month : Number,
		year : Number
	},
	hireDate : Date,
	orientationDate : Date,
	firstShiftDate : Date,
	deactivationDate : Date,
	address : {
		street : String,
		suite : String,
		city : String,
		state : String,
		zipCode : String,
		neighborhood : String
	},
	phoneNumber : String,
	email : String,
	attire : {
		shirtType : { type:String, default:"unknown" },
		shirtSize : { type:String, default:"unknown" },
		hatSize : { type:String, default:"unknown" },
		chefCoatSize : { type:String, default:"unknown" }
	},
	supervisor : String,
	department : String,
	workerType : String,
	documentation : {
		/**
		 * W4 is due before first shift
		 * I9 is due within 3 days of first shift
		 * Quiz is due within 2 weeks of hire date
		 * Food Card is due within 2 weeks of hire date
		 * Mast is due within 2 months of hire date (or 1st shift if bartender)
		 * Orientation is due within 2 months of hire date
		 */
		w4 : { isValid : Boolean, notes : String },
		i9sectionOne : { isValid : Boolean, notes : String },
		i9sectionTwo : { isValid : Boolean, notes : String },
		i9sectionThree : { isValid : Boolean, notes : String },
		i9documents : {
			listA : { doctype : String, isValid : Boolean, expirationDate : Date },
			listB : { doctype : String, isValid : Boolean, expirationDate : Date },
			listC : { doctype : String, isValid : Boolean, expirationDate : Date }
		},
		c3quiz : Boolean,
		foodWorkerCard : { isValid : Boolean, expirationDate : Date },
		mastPermit : { doctype : String,
		               isValid : Boolean,
		               isTemporary : Boolean,
		               expirationDate : Date,
		               notes : String }
	}
});

var Notification = mongoose.model('Notification', {
	date : Date,
	employeeNotified : mongoose.Schema.Types.ObjectId,
	purpose : String,
	notificationMethod : String,
	sentBy : mongoose.Schema.Types.ObjectId,
	note : String
});

/**
 * Evaluation is due at 2 month mark, 6 month mark and then every 6 months
 */
var Evaluation = mongoose.model('Evaluation', {
	dueDate : Date,
	employee : mongoose.Schema.Types.ObjectId,
	evaluator : mongoose.Schema.Types.ObjectId,
	stage : String,
	note : String
});

// routes ======================================================================

app.get('/api/employees', function (request, response) {
	Employee.find(function(err, employees) {
		if(err) {
			response.send(err);
		}
		
		response.json(employees);
	});
});

app.get('/api/employees/birthdays', function (request, response) {
	var maxDaysPerMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var today = new Date();
	var thisMonth = today.getMonth() + 1;
	var nextMonth = (thisMonth + 1) % 12;
	if(nextMonth === 0) {
		nextMonth = 1;
	}
	
	var LOOKAHEAD = 10;
	var thisDay = today.getDate();
	var doesDayOverflow = maxDaysPerMonth[thisMonth] < thisDay + LOOKAHEAD;
	var maxDayThisMonth = doesDayOverflow ? maxDaysPerMonth[thisMonth] : thisDay + LOOKAHEAD;
	var maxDayNextMonth = doesDayOverflow ? (thisDay + LOOKAHEAD) % maxDaysPerMonth[thisMonth] : 0;
	
	Employee.find({'$or':[
		{'$and':[{'dob.month':thisMonth},{'dob.day':{'$lte':maxDayThisMonth,'$gte':thisDay}}]},
		{'$and':[{'dob.month':nextMonth},{'dob.day':{'$lte':maxDayNextMonth}}]}]})
		.select({firstName:1, lastName:1, dob:1})
		.exec(function (err, employees) {
			if(err) {
				response.send(err);
			}
		
			response.json(employees);
		});
});

app.post('/api/employees', function (request, response) {
	Employee.create(request.body, function(err, employee) {
		if(err) {
			response.send(err);
		}
		
		response.json(employee);
	});
});

app.put('/api/employees/:id', function (request, response) {
	Employee.findOneAndUpdate({ '_id' : request.params.id}, request.body, {upsert : false}, function(err, employee) {
		if(err) {
			response.send(err);
		}
		
		response.json(employee);
	});
});

app.get('/api/notifications', function (request, response) {
	Notification.find(function(err, notifications) {
		if(err) {
			response.send(err);
		}
		
		response.json(notifications);
	});
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");