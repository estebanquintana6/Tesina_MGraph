(function () {
    'use strict';
    angular.module('app')
        .controller('customerController', ['$scope', '$rootScope','$location', '$q', '$http', '$mdDialog', CustomerController]);

    function CustomerController($scope, $rootScope, $location, $q, $http, $mdDialog) {

      $scope.appName = "MGraph";
      $rootScope.work_folder = "";
      $rootScope.maxTime = 0;

      $rootScope.data = [];

      $scope.start_app = function() {
        $rootScope.work_folder = document.getElementById("filepicker").files[0].path;
        $rootScope.coordinate_file = document.getElementById("filecoor").files[0].path;

        readFiles();

        getJsonData(fillData);
        readCoordinates();
        console.log($rootScope.work_folder);
        console.log($rootScope.data);

      }

      function getJsonData(_callback){
        var path = require('path'), fs=require('fs');
        var startPath = $rootScope.work_folder;
        var results = [];

        var files=fs.readdirSync(startPath);
        for(var i=0;i<files.length;i++){
          var filename=path.join(startPath,files[i]);
          var stat = fs.lstatSync(filename);
          if (filename.indexOf('.txt')>=0) {
              console.log('-- found: ',filename);
              fs.readFile(filename, 'utf8', function(err, data) {
                  if (err) throw err;

                  results.push(JSON.parse("[" + data + "]"));
              });
          }
        }
        $rootScope.pieData = results;

        setTimeout(function(){ _callback() }, 1000);
      }

      function readCoordinates(){
          var coor_path = $rootScope.work_folder + "\\mapped_coordinates.json";
          $rootScope.coorData = require(coor_path);
          console.log($rootScope.coorData);
      }

      function readFiles() {
        var spawn = require("child_process").spawn;

        var py = spawn('python',["parse.py",
                                $rootScope.work_folder,
                                $rootScope.coordinate_file]);
        var dataString = '';

        py.stdout.on('data', function(data){
          dataString += data.toString();
        });

        py.stdout.on('end', function(){
          console.log('Ended');
        });

        py.stdin.end();

      }

      function fillData() {
        var d = [];

        for( var i = 0; i< $rootScope.pieData.length; i++){
          d.push($rootScope.pieData[i][0]);
        }
        $rootScope.data = d;
        $rootScope.maxTime = $rootScope.pieData[0].length;
        console.log($rootScope.data);
        $location.path('/menu');
      }


    }

})();
