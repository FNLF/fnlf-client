angular.module('reportingApp')
	.service('FileService', ['$http', '$q', function ($http, $q) {

	var urlBase = '/api/v1';

		this.fetchFileInfo = function(objectid) {

			var request = $http({
				method : "get",
				url : urlBase + '/files/' + objectid + '?projection={"file": 0}',
				cache: true
			});
			return (request.then(handleSuccess, handleError));

		};
		var fetchFileInfoFn = this.fetchFileInfo;

		this.fetchImageFile = function(objectid) {
			var request = $http({
				method : "get",
				url : urlBase + '/download/image/' + objectid + '/small',
				cache: true
			});
			return (request.then(handleSuccess, handleError));
		};

		var fetchImageFileFn = this.fetchImageFile;

		this.fetchFullsizeFile = function(objectid) {
			var request = $http({
				method : "get",
				url : urlBase + '/download/image/' + objectid + '/large'
			});
			return (request.then(handleSuccess, handleError));

		};
		var fetchFullsizeFileFn = this.fetchFullsizeFile;

		this.buildFile = function(file,filelist,nonimages,thumbnails,token) {
			fetchFileInfoFn(file['f'])
				.then(function(response) {
					var fileObj = {'name': response.name,
					 'type': response.content_type,'size': bytesToSizeFn(response.size),
					 'url': urlBase + '/download/' + response._id + '?token=' + token,
					 '_id': response._id};


					filelist.push(fileObj);

					if(response.content_type.match(/image/g) != null) {
						getImageFileFn(response._id,fileObj.name, fileObj.size,thumbnails);
					}else {
						nonimages.push(fileObj);
					}
				});
        };

		this.getImageFile = function(objectid, filename, filesize,thumbnails) {
				 fetchImageFileFn(objectid).then(function(response) {
					 thumbnails.push({src: 'data:'+response.mimetype+';charset=utf8;base64,'+response.src, objectid: objectid, filename:filename, filesize:filesize});
				 });

			 };
		var getImageFileFn=this.getImageFile;

		function handleError(response) {
			if (!angular.isObject(response.data) || !response.data.message) {
				return ($q.reject("An unknown error occurred."));
			}
			return ($q.reject(response.data.message));
		}

		function handleSuccess(response) {
			return (response.data);
		};

		this.bytesToSize = function(bytes) {
			   if(bytes == 0) return '0 Byte';
			   var k = 1000;
			   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			   var i = Math.floor(Math.log(bytes) / Math.log(k));
			   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
			};
		var bytesToSizeFn = this.bytesToSize;

	}]);