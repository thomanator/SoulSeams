(function () {
  angular
    .module('app')
    .controller('contactController', contactController);

  contactController.$inject = ['$scope', '$timeout', '$rootScope', '$state', '$http','$element','ScrollerService','appData','$element'];

  function contactController ($scope, $timeout, $rootScope, $state, $http, $element, ScrollerService, appData, $element) {
    $scope.navigate = false;
    $scope.showDiv = false;
    $scope.showText = false;
    $scope.removeText = false;
    $scope.contact = {};
    $rootScope.module = 'partner';

    $scope.next = next;
    $scope.prev = prev;
    $scope.submit = submit;

    $timeout(function() {
      $scope.showText = true;
      // $timeout(function() {
      //   $scope.showText = true;
      // }, 1150);
    }, 1);

    var unRegisterListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if(!$scope.navigate) {
        event.preventDefault();
        $scope.showDiv = false;
        $scope.removeText = true;
        $timeout(function() {
          $scope.showText = false;
          $scope.navigate = true;
          $state.go(toState, toParams);
        }, 1000)
      }
    });

    $scope.$on('$destroy', function() {
      unRegisterListener();
      ScrollerService._unbindScroll($element);
    });

    function next () {
      $state.go('link');
    }

    function prev () {
      $state.go('about');
    }

    function submit () {
      if(valid()) {
        $http({
          url: '/enquiry',
          method: 'POST',
          data: $scope.contact
        }).then(function (data) {
          if(data.data.status == 'success') {
            $scope.showSuccessMessage = true;
            $scope.contact = {};
          }
          else {
            $scope.showErrorMessage = true;
            $scope.errorMessage = data.data.message || 'Could not complete your request. Please try later';
          }
        }, function (error) {
          $scope.showErrorMessage = true;
          $scope.errorMessage = error.data.statusText;
        });
      }
    }

    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

      ScrollerService._bindScroll($element,2);

    function valid () {
      var valid = true;
      $scope.error = '';
      if(!$scope.contact.name || !$scope.contact.name.trim().length||!$scope.contact.email || !$scope.contact.email.trim().length||!$scope.contact.number) {
        valid = false;
        $scope.error = '* Please enter your Name, valid Email ID and Phone Number';
      }      
      /*
      if(!$scope.contact.number || !$scope.contact.number.length) {
        if($scope.error.length) {
          $scope.error += ', ';
        }
        $scope.error += 'Number';
        valid = false;
      }

      if(!$scope.contact.description || !$scope.contact.description.trim().length) {
        if($scope.error.length) {
          $scope.error += ', ';
        }
        $scope.error += 'Description';
        valid = false;
      }

      if(!$scope.contact.email || !$scope.contact.email.trim().length) {
        if($scope.error.length) {
          $scope.error += ', ';
        }
        $scope.error += 'Email ID';
        valid = false;
      }
      if($scope.error.length) {
        $scope.error += ' is/are required.';
        valid = false;
      }
      
      
      if(!$scope.contact.number) {
        console.log('coming to the second error check')
        $scope.error = 'please enter a valid phone number'
        valid = false;
      }
      */

      if($scope.contact.email && !validateEmail($scope.contact.email)) {
        $scope.error += ' Please enter a valid email id.'
        valid = false;
      }
      return valid;
    }


  }
})()
