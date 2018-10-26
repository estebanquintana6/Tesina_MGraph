(function () {
    'use strict';
    angular.module('app')
        .controller('customerController', ['$scope', '$rootScope','$location', '$q', '$http', '$mdDialog', '$timeout', CustomerController]);

    function CustomerController($scope, $rootScope, $location, $q, $http, $mdDialog, $timeout) {

      $scope.appName = "MGraph";
      $rootScope.work_folder = "";
      $rootScope.maxTime = 0;
      $rootScope.pieData = [];
      $rootScope.data = [];

      $scope.start_app = function() {
        readCoordinates();
        fillData();
      }

      $scope.getFileDetails = function (e) {
          $scope.files = [];
          $scope.$apply(function () {
              // STORE THE FILE OBJECT IN AN ARRAY.
              for (var i = 0; i < e.files.length; i++) {
                  $scope.files.push(e.files[i].path)
              }

              $scope.files = $scope.files.sort();
              console.log($scope.files);
          });

          $rootScope.work_folder = require('path').dirname($scope.files[0]);
          var spawn = require("child_process").spawn;

          var py = spawn('python',["parseFiles.py",
                                  $scope.files]);

          var dataString = '';

          py.stdout.on('data', function(data){
            dataString += data.toString();
          });


          py.stdin.end();

          $timeout(function(){getJsonData();},500);

      };

      $scope.getCoorDetails = function(e){
          $rootScope.coordinate_file = document.getElementById("filecoor").files[0].path;
          var spawn = require("child_process").spawn;

          var py = spawn('python',["parseCoors.py",
                                  $rootScope.coordinate_file,
                                  $rootScope.work_folder]);
          var dataString = '';

          py.stdout.on('data', function(data){
            dataString += data.toString();
          });

          py.stdin.end();
      }

      function getJsonData(){
        var path = require('path'), fs=require('fs');
        var startPath = $rootScope.work_folder;

        var files=fs.readdirSync(startPath);
        console.log(files);
        var txts = [];
        for(var i=0;i<files.length;i++){
          var filename=path.join(startPath,files[i]);
          var stat = fs.lstatSync(filename);
          if (filename.indexOf('.txt')>=0) {
              txts.push(filename);
              console.log('-- found: ',filename);
              fs.readFile(filename, 'utf8', function(err, data) {
                  if (err) throw err;
                  $rootScope.pieData.push(JSON.parse("[" + data + "]"));
              });
          }
        }
      }

      function readCoordinates(){
          var coor_path = $rootScope.work_folder + "\\mapped_coordinates.json";
          var headers = $rootScope.work_folder + "\\headers.json";
          $rootScope.coorData = require(coor_path);
          $rootScope.headers = require(headers);
          console.log($rootScope.coorData);
      }

      function fillData() {
        var d = [];

        for( var i = 0; i< $rootScope.pieData.length; i++){
          d.push($rootScope.pieData[i][0]);
        }
        $rootScope.data = d;
        $rootScope.maxTime = $rootScope.pieData[0].length;
        $location.path('/menu');
      }


    }

})();
