'use strict';

/* Services */

flashcardApp.service('appManager', function() {
  this.stackHolder = {};
  this.userHolder = {};

  this.setStack =  function(newObj) {
      this.stackHolder['stack'] = newObj;
  };
  this.getStack = function(){
      return this.stackHolder['stack'];
  };
  this.setUser = function(newObj) {
      console.log("Setting user to: " + newObj);
      console.log(newObj);
      console.log(this.userHolder['user']);
      this.userHolder['user'] = newObj;
      console.log(this.userHolder['user']);
  };
  this.getUser = function(){
      return this.userHolder['user'];
  };
});

/* Factories */

flashcardApp.factory('stacksFactory', function($http) {
  return {
    getStacks: function(){
    	return $http.get('http://localhost:3000/api/v1/stacks').then(function(result){
    		return result.data;
    	});
    },
    createStack: function(userId, stackInfo){
      var stack = {stack: stackInfo};
      return $http.post('http://localhost:3000/api/v1/users/' + userId + '/stacks', stack).then(function(result){
        return result.data;
      });
    }
  };
});

flashcardApp.factory('cardsFactory', function($http) {
  return {
    getCard: function(cardId){
      return $http.get('http://localhost:3000/api/v1/cards/' + cardId).then(function(result){
        return result.data;
      });
    },
    getCards: function(stackId){
      return $http.get('http://localhost:3000/api/v1/stacks/' + stackId + '/cards').then(function(result){
        return result.data;
      });
    },
    createCard: function(stackId, stackInfo){
      var stack = {stack: stackInfo};
      return $http.post('http://localhost:3000/api/v1/stacks/' + stackId + '/cards', stack).then(function(result){
        return result.data;
      });
    }
  };
});

flashcardApp.factory('usersFactory', function($http) {
  return {
    getUser: function(userId){
      return $http.get('http://localhost:3000/api/v1/users/' + userId).then(function(result){
        return result.data;
      });
    },
    getUsers: function(){
    	return $http.get('http://localhost:3000/api/v1/users').then(function(result){
    		return result.data;
    	});
    },
    createUser: function(userInfo){
    	var user = {user: userInfo};
    	return $http.post('http://localhost:3000/api/v1/users', user).then(function(result){
    		return result.data;
    	});
    },
    getUserStacks: function(userId){
      return $http.get('http://localhost:3000/api/v1/users/' + userId + '/stacks').then(function(result){
        return result.data;
      });
    }
  };
});

flashcardApp.factory('subjectsFactory', function($http){
  return{
    getSubjects: function(){
      return $http.get('http://localhost:3000/api/v1/subjects').then(function(result){
        return result.data;
      });
    }
  };
});


/* interceptors */

flashcardApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.token  = $window.sessionStorage.token;
      }
      if ($window.sessionStorage.email) {
        config.headers.email = $window.sessionStorage.email;
      }


      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        document.location.href = "/app/index.html";
      }
      return response || $q.when(response);
    }
  };
});

flashcardApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');
