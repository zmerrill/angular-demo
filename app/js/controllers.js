'use strict';

/* Controllers */

var flashcardApp = angular.module('flashcardApp', ['ngRoute']);

flashcardApp.config(['$routeProvider', function($routeProvider) {
  //$routeProvider.when('/signin', {templateUrl: 'partials/signin.html', controller: 'LoginCtrl'});
  $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'RegCtrl'});
  $routeProvider.when('/main', {templateUrl: 'partials/main.html', controller: 'StacksListCtrl'});
  $routeProvider.otherwise({redirectTo: '/register'});
}]);

flashcardApp.controller('StacksListCtrl', function ($scope, stacksFactory, usersFactory, subjectsFactory, $http, $window, appManager, $location) {
  if ($window.sessionStorage.token == null){
    $location.path("register");
    return;
  };

  $scope.subjectSelection = null;

  $scope.submit = function () {
    console.log("ikki" + $scope.subjectSelection);
    $scope.stack.subject_id = $scope.subjectSelection.id;
    stacksFactory.createStack(appManager.getUser().id, $scope.stack).then(function(data){
      //$scope.stack = data.stack;
      console.log(data);
      $scope.stacks.push(data.stack);
      $scope.stack = null;
      $scope.subjectSelection = null;
      $scope.addStackForm.$setPristine();
      $scope.modalShown = !$scope.modalShown;
    });
  };

  $scope.modalShown = false;
  $scope.toggleModal = function() {
    console.log($scope.modalShown);
    $scope.modalShown = !$scope.modalShown;
  };

  
  usersFactory.getUserStacks(appManager.getUser().id).then(function(data){
  	$scope.stacks = data.stacks;
  	console.log(data);
  });

  usersFactory.getUser(appManager.getUser().id).then(function(data){
  	$scope.user = data.user;
  	console.log(data);
  });

  subjectsFactory.getSubjects().then(function(data){
    $scope.subjects = data.subjects;
    console.log(data);
  });

  $scope.currentStackId = null;
  $scope.selectStack = function (stack){
      console.log("Selecting stack " + stack);
      appManager.setStack(stack);
      $scope.currentStackId = appManager.getStack().id;
  };
});

flashcardApp.controller('RegCtrl', function ($scope, $http, usersFactory, $window, appManager, $location) {
  if ($window.sessionStorage.token != null){
    $location.path("main");
    return;
  }
  $scope.user = {email: '', password: ''};
  $scope.message = '';
  $scope.submit = function () {
  	usersFactory.createUser($scope.user).then(function(data){
  		//$scope.user = data.user;
  		console.log($scope.user);
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
  	});
  };
});
