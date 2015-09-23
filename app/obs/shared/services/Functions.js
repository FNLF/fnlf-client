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

			this.capitalizeFirstLetter = function(string) {
				if(!string){
			  		return '';
				}
				string = string.toLowerCase();
            	return string.charAt(0).toUpperCase() + string.slice(1);
            };

			var difference = function(o1, o2,pre) {
				pre = pre + '.';

				var k, kDiff,
					diff = {};
				for (k in o1) {
					if (!o1.hasOwnProperty(k)) {
					} else if (typeof o1[k] != 'object' || typeof o2[k] != 'object') {
						if (!(k in o2) || o1[k] !== o2[k]) {
							diff[pre+k] = o2[k];
						}
					} else if (kDiff = difference(o1[k], o2[k],pre+k)) {
						diff[pre+k] = kDiff;
					}
				}
				for (k in o2) {
					if (o2.hasOwnProperty(k) && !(k in o1)) {
						diff[pre+k] = o2[k];
					}
				}
				for (k in diff) {
					if (diff.hasOwnProperty(k)) {
						return diff;
					}
				}
				return false;
			};
			this.objectDifference = function(o1,o2,objectLabel){
				return difference(angular.fromJson(angular.toJson(o1)),angular.fromJson(angular.toJson(o2)),objectLabel);
			};

	});
})();
