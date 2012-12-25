var storageKeyUrl = "tagbook-url";
var storageKeyUsername = "tagbook-username";
var storageKeyPassword = "tagbook-password";

function OptionsCtrl($scope) {
  $scope.url = localStorage.getItem(storageKeyUrl) || "";
  $scope.username = localStorage.getItem(storageKeyUsername) || "";
  $scope.password = localStorage.getItem(storageKeyPassword) || "";

  $scope.message = null;
  $scope.error = null;

  $scope.hideMessages = function() {
    $scope.message = null;
    $scope.error = null;
  };

  $scope.save = function() {
    $scope.hideMessages();
    localStorage.setItem(storageKeyUrl, $scope.url);
    localStorage.setItem(storageKeyUsername, $scope.username);
    localStorage.setItem(storageKeyPassword, $scope.password);
    $scope.message = "Successfully saved"
  };

  $scope.test = function($event) {
    $event.preventDefault();
    $scope.hideMessages();

    jQuery.ajax({
      url: $scope.url + "/info",
      username: $scope.username,
      password: $scope.password,
      dataType: "json",
      success: function(data) {
        $scope.$apply(function($scope) {
          $scope.message = "Connection data is fine!";
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $scope.$apply(function($scope) {
          $scope.error = "Oh boy, some error occurred: " + errorThrown;
        });
      }
    });
  };

}