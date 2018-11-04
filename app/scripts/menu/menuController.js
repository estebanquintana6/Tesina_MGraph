  (function () {
    'use strict';
    angular.module('app')
        .controller('menuController', ['$scope', '$rootScope', '$location','$q', '$http', '$mdDialog','$interval', '$timeout', MenuController]);

    function MenuController($scope, $rootScope, $location, $q, $http, $mdDialog, $interval,$timeout) {

      var d3 = require("d3");
      $scope.appName = "MGraph";
      console.log($rootScope.work_folder);

      $scope.pause = false;
      $scope.status = "Pause";
      $scope.parsedFiles = [];
      $scope.time = 0;
      var stop;
      var pieT;

      $scope.logout = function(){
        $interval.cancel(stop);
        $interval.cancel(pieT);
        stop = undefined;
        $rootScope.pieData = null;
        $rootScope.coorData = null;
        $rootScope.headers = null;
        $rootScope.maxTime = 0;
        $rootScope.work_folder = null;
        $rootScope.clusters = null;
        $scope.parsedFiles = [];
        $rootScope.data = [];
        $location.path('/');
      }

      $scope.stop = function(){
          $scope.pause = !$scope.pause;
          if($scope.pause == true){
              $scope.status = "Play";
          } else {
              $scope.status = "Pause";
          }
      }

      var data = $rootScope.data;

      function getDataInTime(t){
          var tdata = [];

          if(t >= $rootScope.maxTime){
            t = 0;
            $scope.time = 0;
          }

          for( var i = 0; i< $rootScope.pieData.length; i++){
            tdata.push($rootScope.pieData[i][t]);
          }

          return tdata;
      }

      function getTimePie() {
          var d = $rootScope.pieData[$scope.selectedPie][$scope.time];

          var table = '<h6>Population node: ' + ($scope.selectedPie + 1) + '</h6><table class="table"><tbody>';

          for(var i = 0; i<d.length; i++){
            table += '<tr><th scope="row" width="50px" bgcolor="' +  $rootScope.mycolors[$rootScope.clusters[$scope.selectedPie]][i] + '">' + $rootScope.headers[i] + '</th><td>' + Math.round(d[i] * 100) / 100 + '</td></tr>';
          }

          table += '</tbody></table>';

          $('#tooltip').html(table)
      }

      // ------------

      var m = 5;
      $scope.radio = 20;


      var svgContainer = d3.select("#pies").append("svg")
                                          .attr("width", "100%")
                                          .attr("height", 800)
                                          .style("border", "1px solid black")
                                          .style("background-color", "white");

      var arc =  d3.svg.arc().outerRadius($scope.radio);

      $scope.updateRadius = function(){
        arc =  d3.svg.arc().outerRadius($scope.radio)
      }

      var pie = d3.layout.pie()
          .value(function(d) { return d; })
          .sort(null);

      var svg = svgContainer.selectAll("svg")
          .data(data)
      	  .enter()
      		.append("svg")
      		.attr("width", "100%")
      		.attr("height", "100%")
      		.attr("id", function(d,i) {return 'pie'+i;})
      		.append("svg:g")
      			.attr("transform", function(d,i) {
              var s = "translate(";
              console.log($rootScope.coorData[i]);
              s+= $rootScope.coorData[i]["x"];
              s+= ",";
              s+= $rootScope.coorData[i]["y"];
              s+=")";
              return s;
            })
            .on("mouseover", function (d, i) {
                $scope.selectedPie = i;
            })
            .on("mouseout", function () {
              /*d3.select("#tooltip")
                .style("opacity", 0);
                */
            });

      var node = 0;

      var path = svg.selectAll("path")
          .data(pie)
      	.enter()
      		.append("svg:path")
          .attr("n", function(d, i) { return i;})
      		.attr("d", arc)
      		.style("fill", function(d, i) {
            var cluster = $rootScope.clusters[node];
            if(i == ($rootScope.pieData[0][0].length - 1)){
              node = node + 1;
            }
            console.log(cluster);
            return $rootScope.mycolors[cluster][i]; })
              .each(function(d) { this._current = d; }); // store the initial angles

      var titles = svg.append("svg:text")
      	.attr("class", "title")
      	.text(function(d,i) {return i+1;})
      	.attr("dy", "5px")
      	.attr("text-anchor", "middle")


      // -- Do the updates
      //------------------------
      stop = $interval(function() {
          change();
      }, 1000);




      function change() {
      	// Update the Pie charts with random data
      	var newdata = getDataInTime($scope.time);
        if($scope.pause == false){
          $scope.time = $scope.time + 1;
        }
      	for(var x in newdata) {
      		var npath = d3.select("#pie"+x).selectAll("path").data(pie(newdata[x]))
      		npath.transition().duration(1000).attrTween("d", arcTween); // redraw the arcs
      	}

        var tdata = '<h5>Genotypes</h5><table class="table"><tbody>'

        var result = newdata.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);

        for( var i = 0; i< result.length; i++){
          tdata += '<tr><th scope="row" width="50px" bgcolor="' +  $rootScope.mycolors[$rootScope.clusters[i]][i] + '">' + $rootScope.headers[i] + '</th><td>' + Math.round(result[i] * 100) / 100 + '</td></tr>';
        }

        tdata += '</tbody></table>';

        $('#pieData').html(tdata)

        //tdata += "<strong>"+colSum+":</strong> " + "<br>";
      }

      function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }
      //
      //
      //
      // Starting the line graph section
      pieT = $interval(function() {
        d3.select("#tooltip")
          .style("opacity", 1);
        getTimePie();
      }, 500);
    }
})();
