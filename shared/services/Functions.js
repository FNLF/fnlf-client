(function () {
	angular.module('fnlf-services')
		.service('Functions', function ($q) {

			this.waitForIt = function ($scope, it) {

				var deferred = $q.defer();
				var unbind = $scope.$watch(it, function () {
					if ($scope[it]) {
						deferred.resolve($scope[it]);
						unbind();
					}

				});
				return deferred.promise;
			};

			this.mapDistance = function (lat1, lon1, lat2, lon2) {
				var toRad = (Math.PI / 180);
				var phi1 = lat1 * toRad
				var phi2 = lat2 * toRad
				var deltaLambda = (lon2 - lon1) * toRad;
				var R = 6371000; // gives d in metres
				var d = Math.acos(Math.sin(phi1) * Math.sin(phi2) + Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaLambda)) * R;
				return d;
			};

			this.copy = function (firstObject, secondObject) {
				for (var k in firstObject) {
					secondObject[k] = firstObject[k];
				}
			};

			this.deduplicate = function (srcArray) {
				var destArray = [];
				var tmp = {};
				srcArray.forEach(function (t) {
					tmp[t] = t;
				});
				Object.keys(tmp).forEach(function (k) {
					destArray.push(tmp[k]);
				});
				return destArray;

			};
			var functionsObj = this;
			this.prepareTags = function (response) {

				var tags = functionsObj.deduplicate(response._items
					.filter(function (t) {
						return (t.freq >= 0 && t.tag.split(' ').length < 5);
					})
					.map(function (t) {
						return functionsObj.capitalizeFirstLetter(t.tag);
					}));
				return tags;
			};

			this.deduplicateById = function (srcArray) {
				var destArray = [];
				var tmp = {};
				srcArray.forEach(function (t) {
					tmp[t.id] = t;
				});
				Object.keys(tmp).forEach(function (k) {
					destArray.push(tmp[k]);
				});
				return destArray;
			};

			this.capitalizeFirstLetter = function (string) {
				if (!string) {
					return '';
				}
				string = string.toLowerCase();
				return string.charAt(0).toUpperCase() + string.slice(1);
			};

			var difference = function (o1, o2, pre) {
				pre = pre + '.';

				var k, kDiff,
					diff = {};
				for (k in o1) {
					if (!o1.hasOwnProperty(k)) {
					} else if (typeof o1[k] != 'object' || typeof o2[k] != 'object') {
						if (!(k in o2) || o1[k] !== o2[k]) {
							diff[pre + k] = o2[k];
						}
					} else if (kDiff = difference(o1[k], o2[k], pre + k)) {
						diff[pre + k] = kDiff;
					}
				}
				for (k in o2) {
					if (o2.hasOwnProperty(k) && !(k in o1)) {
						diff[pre + k] = o2[k];
					}
				}
				for (k in diff) {
					if (diff.hasOwnProperty(k)) {
						return diff;
					}
				}
				return false;
			};
			this.objectDifference = function (o1, o2, objectLabel) {
				return difference(angular.fromJson(angular.toJson(o1)), angular.fromJson(angular.toJson(o2)), objectLabel);
			};


			var stopWords = ['og', 'i', 'jeg', 'det', 'at', 'en', 'et', 'den', 'til', 'er', 'som', 'på', 'de', 'med',
				'han', 'av', 'ikke', 'ikkje', 'der', 'så', 'var',
				'meg', 'seg', 'men', 'ett', 'har', 'om', 'vi', 'min',
				'mitt', 'ha', 'hadde', 'hun', 'nå', 'over', 'da', 'ved',
				'fra', 'du', 'ut', 'sin', 'dem', 'oss', 'opp', 'man', 'kan',
				'hans', 'hvor', 'eller', 'hva', 'skal', 'selv', 'sjøl', 'her',
				'alle', 'vil', 'bli', 'ble', 'blei', 'blitt', 'kunne', 'inn', 'når',
				'være', 'kom', 'noen', 'noe', 'ville', 'dere', 'som', 'deres', 'kun',
				'ja', 'etter', 'ned', 'skulle', 'denne', 'for', 'deg', 'si', 'sine',
				'sitt', 'mot', 'å', 'meget', 'hvorfor', 'dette', 'disse', 'uten',
				'hvordan', 'ingen', 'din', 'ditt', 'blir', 'samme', 'hvilken', 'hvilke',
				'sånn', 'inni', 'mellom', 'vår', 'hver', 'hvem', 'vors', 'hvis', 'både', 'bare',
				'enn', 'fordi', 'før', 'mange', 'også', 'slik', 'vært', 'være', 'båe', 'begge', 'siden', 'dykk',
				'dykkar', 'dei', 'deira', 'deires', 'deim', 'di', 'då', 'eg', 'ein', 'eit', 'eitt', 'elles', 'honom',
				'hjå', 'ho', 'hoe', 'henne', 'hennar', 'hennes', 'hoss', 'hossen', 'ikkje', 'ingi', 'inkje',
				'korleis', 'korso', 'kva', 'kvar', 'kvarhelst', 'kven', 'kvi', 'kvifor', 'me', 'medan', 'mi', 'mine',
				'mykje', 'no', 'nokon', 'noka', 'nokor', 'noko', 'nokre', 'si', 'sia', 'sidan', 'so', 'somt', 'somme',
				'um', 'upp', 'vere', 'vore', 'verte', 'vort', 'varte', 'vart', 'mens', 'under', 'kort', 'lang', 'annen'];

			var stopWordsObj = {};


			angular.forEach(stopWords, function (s) {
				stopWordsObj[s] = true;
			});

			var cfl = this.capitalizeFirstLetter;

			this.autoTag = function (inputString) {
				if (angular.isUndefined(inputString)) {
					return [];
				}

				inputString = inputString.substr(0);
				inputString = inputString.toLowerCase();
				inputString = inputString.replace(/[,.!?]/g, ' ');
				inputString = inputString.replace(/[/()]/g, ' ');
				inputString = inputString.replace('"', ' ');
				inputString = inputString.replace(/\s+/g, " ");
				inputString = inputString.replace(/\d+/g, " ");

				inputString = inputString.trim();

				var split = inputString.split(' ');
				if (split.length < 2) {
					return [];
				}

				var washed = [];
				angular.forEach(split, function (s) {
					s = s.trim();
					if (s.length > 3 && !stopWordsObj[s]) {
						washed.push(cfl(s));
					}
				});
				return washed;
			};

		});
})();
