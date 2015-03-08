(function () {
	angular.module('reportingApp')
		.service('Functions',  function () {

			this.copy  = function(firstObject,secondObject){
				for(var k in firstObject){
					secondObject[k]=firstObject[k];
				}
			};

			this.deduplicate  = function(srcArray){
					var destArray = [];
					var tmp ={};
					srcArray.forEach(function(t){
						tmp[t]=t;
					});
					Object.keys(tmp).forEach(function(k){
						destArray.push(tmp[k]);
					});
					return destArray;

			};

			this.deduplicateById  = function(srcArray){
					var destArray = [];
					var tmp ={};
					srcArray.forEach(function(t){
						tmp[t.id]=t;
					});
					Object.keys(tmp).forEach(function(k){
						destArray.push(tmp[k]);
					});
					return destArray;
			};

	});
})();
