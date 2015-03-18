(function () {
	angular.module('reportingApp')
		.service('Functions',  function () {

			this.mapDistance = function(lat1,lon1,lat2,lon2){

				var phi1 = lat1.toRadians(), phi2 = lat2.toRadians(), deltaLambda = (lon2-lon1).toRadians(), R = 6371000; // gives d in metres
				var d = Math.acos( Math.sin(ph11)*Math.sin(ph12) + Math.cos(ph11)*Math.cos(ph12) * Math.cos(deltaLambda) ) * R;
				return d;
			};

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
