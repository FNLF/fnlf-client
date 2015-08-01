(function () {

	/**
	 *
	 * @author: Tore Buer, s180346
	 * @author: Eivind Jacobsen, s173466
	 * @author: Morten Kristoffersen, s169440
	 *
	 * @since may.26.2014
	 *
	 */
	angular.module('reportingApp')
		.controller('ObservationController',
		function ($scope, ObservationService,$routeParams,$timeout) {
			var observationId = $routeParams.id;
			$scope.observation = {id:observationId};
			$scope.observationChanges = false;

			ObservationService.getObservationById(observationId, function(obs){
				
				$scope.observation = obs;

				$timeout(function(){
					$scope.observationChanges = false;
				},10);
			});

			var ItemType = function ItemType(type,label){
				this.type=type;
				this.label=label;
				this.used=false;
			};

			$scope.items=[
				new ItemType('location','Sted'),
				new ItemType('organization','Hoppfeltorganisering'),
				new ItemType('involved','Involverte personer'),
				new ItemType('components','Observasjonsforløp')
			];

		$scope.saveObservation = function () {
			ObservationService.updateObservation($scope.observation,function(updated){
				$scope.observation = updated;

				/**
				 * Reset saved/unsaved label
				 */
				$timeout(function(){
					$scope.observationChanges = false;
				},100);

			});
		};

		/**
		 * Triggers saved/unsaved label
		 * 
		 * Note it needs to load first...
		 */
		$scope.observationChanges = false;
<<<<<<< Temporary merge branch 1
		$scope.$watch('observation', function(changedObs,oldObs) {
			if(oldObs._id) {
				console.log("Changed");
				console.log(oldObs);
				console.log("->");
				console.log(changedObs);
				$scope.observationChanges = true;
			}
=======
		$scope.$watch('observation', function(newValue, oldValue) {
			console.log("Changed");
			$scope.observationChanges = true;
>>>>>>> Temporary merge branch 2
		},true);

		});

})();