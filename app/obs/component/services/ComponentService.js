(function () {

	angular.module('reportingApp')
		.service('ComponentService', function (Definitions, Functions,$location) {


			var reorderFunc = function(components){
        		var orderedComponents = components.sort(function(a,b){return a.order-b.order});
        		var i = 1;
        		orderedComponents.forEach(function(c){
        			c.order = i;
        			i++;
        		});

        	};
        	this.reorder = function(components){
        		reorderFunc(components);
        	};

        	var decrementOrderFunc = function(components,component){
        		component.order = component.order-1.1;
        		reorderFunc(components);
        	};
        	this.decrementOrder = function(components,component){
        		decrementOrderFunc(components,component);
        	};

        	var incrementOrderFunc = function(components,component){
        		component.order = component.order+1.1;
        		reorderFunc(components);
        	};
        	this.incrementOrder = function(components,component){
        		incrementOrderFunc(components,component);
        	};





		});


})();
