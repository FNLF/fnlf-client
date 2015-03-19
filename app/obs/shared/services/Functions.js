(function () {
	angular.module('reportingApp')
		.service('Functions',  function () {

			this.mapDistance = function(lat1,lon1,lat2,lon2){
				var toRad = (Math.PI /180);
				var phi1 = lat1 * toRad
				var phi2 = lat2 * toRad
				var deltaLambda = (lon2-lon1) * toRad;
				var R = 6371000; // gives d in metres
				var d = Math.acos( Math.sin(phi1)*Math.sin(phi2) + Math.cos(phi1)*Math.cos(phi2) * Math.cos(deltaLambda) ) * R;
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
