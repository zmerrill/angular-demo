'use strict';

/* Directives */
flashcardApp.directive('login', function($http, $window, $location, appManager) {
  return {
    restrict: 'AE',
    scope: {},
    link: function(scope, elem, attrs) {
    	scope.submit = function() {
    		console.log($http);
    		signin(scope, $http, $window, $location, appManager);
    	};
    	scope.user = {email: '', password: ''};
    },
    templateUrl: 'partials/signin.html'
  };
});

flashcardApp.directive('logout', function($http, $window, $location, appManager) {
  return {
    restrict: 'AE',
    scope: {},
    link: function(scope, elem, attrs) {
    	scope.signout = function() {
    		console.log($http);
    		signout(scope, $http, $window, $location, appManager);
    	};
    },
    template: '<ul class="menu">' +
    			'<li><a href="#" ng-click="signout();">Sign Out</a></li>' +
			   '</ul>'
  };
});


flashcardApp.directive('modalDialog', function() {
  return {
    restrict: 'AE',
    scope: false,
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function($scope, element, attrs) {
      $scope.dialogStyle = {};
      if (attrs.width)
        $scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        $scope.dialogStyle.height = attrs.height;
      $scope.hideModal = function() {
        $scope.modalShown = false;
      };
    },
    template: "<div class='ng-modal' ng-show='modalShown'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});



function signin($scope, $http, $window, $location, appManager) {
    $http
      .post('http://localhost:3000/api/v1/signin', $scope.user)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token.access_token;
        $window.sessionStorage.email = data.user.email;
        console.log(appManager.getUser());
        appManager.setUser(data.user);
        console.log(data.user);
        $location.path("main");
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.email;
        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });           
}

function signout($scope, $http, $window, $location, appManager) {
    $http
      .delete('http://localhost:3000/api/v1/signout', $scope.user)
      .success(function (data, status, headers, config) {
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.email;
        appManager.setUser(null);
        $location.path("register");
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;

        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });           
}
