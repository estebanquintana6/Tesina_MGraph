(function () {
    'use strict';
    angular.module('app')
        .controller('customerController', ['$scope', '$rootScope','$location', '$q', '$http', '$mdDialog', '$timeout','$interval', CustomerController]);

    function CustomerController($scope, $rootScope, $location, $q, $http, $mdDialog, $timeout, $interval) {
      var randomColor = require('randomcolor');

      $scope.appName = "MGraph";
      $rootScope.work_folder = "";
      $rootScope.maxTime = 0;
      $rootScope.pieData = [];
      $rootScope.data = [];
      $rootScope.mycolors = require('./color.json');
      $scope.clusterNumber = 1;
      $scope.selectedRow = 0;

      var clusterInterval;

      $scope.start_app = function() {
        $timeout(function () {
          $interval.cancel(clusterInterval);
          readCoordinates();
          fillData();
        },5000);
      }

      $scope.generateMatrix = function(){
        console.log($scope.selectedRow);
        console.log($rootScope.mycolors[$scope.selectedRow]);
        var color = randomColor({
           count: 100,
           hue: $scope.selectedColor
        });
        setTimeout(function(){$rootScope.mycolors[$scope.selectedRow] = color;}, 100);
        console.log(color);
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

          $scope.getClusters();
      }

      $scope.getClusters = function(){
        var cno = document.getElementById("clusters").value;
        console.log(cno);
        var spawn = require("child_process").spawn;
        var fs = require('fs');

        var py = spawn('python',["get_clusters.py",
                                $rootScope.coordinate_file,
                                $rootScope.work_folder,
                                cno]);

        var clusterData = '';
        py.stdout.on('data', function(data) {
            //Here is where the output goes
        });


        py.stdin.end();

        var clusters = $rootScope.work_folder + '/cluster_info.json';
        var obj = JSON.parse(fs.readFileSync(clusters, 'utf8'));

        $rootScope.clusters = obj;

      }

      clusterInterval = $interval($scope.getClusters, 500);

      function getJsonData(){
        var path = require('path'), fs=require('fs');
        var startPath = $rootScope.work_folder;
        var txts = [];

        var matrix = startPath + '/matrix.json';

        var pieData = require(matrix);

        for( var p in pieData){
          $rootScope.pieData.push(pieData[p]);
        }

        $timeout(function(){console.log($rootScope.pieData)},1000);

      }

      function readCoordinates(){
          var coor_path = $rootScope.work_folder + "/mapped_coordinates.json";
          var headers = $rootScope.work_folder + "/headers.json";
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
        $rootScope.maxTime = $rootScope.pieData[0].length - 1;
        $location.path('/menu');
      }


    }

})();
