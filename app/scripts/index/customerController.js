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
        console.log($rootScope.work_folder);

        readFiles();
        $rootScope.pieData = getJsonData();
        console.log($rootScope.data);
        setTimeout(function(){fillData(); changeWindow();}, 1000);

      }

      function changeWindow(){
        $location.path('/menu');
      }

      function getJsonData(){
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
        return results;
      }

      function readFiles() {
        var spawn = require("child_process").spawn;

        var py = spawn('python',["parse.py",
                        $rootScope.work_folder]);
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
      }


    }

})();
