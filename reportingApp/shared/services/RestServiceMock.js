angular.module('reportingApp', ['ngMockE2E'])
  .run(function($httpBackend) {


	var stians = [];
	stians.push({fullname:"Stian Skansen",id:"1"});
	stians.push({fullname:"Stian Kristiansen",id:"2"});
	stians.push({fullname:"Stian Knutsen",id:"3"});

    $httpBackend.whenGET('/melwin/users')
      .respond(stians);

});