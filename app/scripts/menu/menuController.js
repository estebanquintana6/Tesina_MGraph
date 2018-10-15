  (function () {
    'use strict';
    angular.module('app')
        .controller('menuController', ['$scope', '$rootScope', '$location','$q', '$http', '$mdDialog','$interval', MenuController]);

    function MenuController($scope, $rootScope, $location, $q, $http, $mdDialog, $interval) {

      var d3 = require("d3");
      var randomColor = require('randomcolor');

      $scope.appName = "MGraph";
      console.log($rootScope.work_folder);

      $scope.parsedFiles = [];
      $scope.time = 0;

      $scope.logout = function(){
        $location.path('/');
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



          console.log(tdata);
          return tdata;
      }

      // ------------

      var m = 5,
          r = 30;

      var mycolors = randomColor({
         count: 100,
         hue: 'green'
      });

      var arc = d3.svg.arc().outerRadius(r)

      var pie = d3.layout.pie()
          .value(function(d) { return d; })
          .sort(null);

      var svg = d3.select("#pies").selectAll("svg")
          .data(data)
      	.enter()
      		.append("svg")
      		.attr("width", (r + m) * 2)
      		.attr("height", (r + m) * 2)
      		.attr("id", function(d,i) {return 'pie'+i;})
      		.append("svg:g")
      			.attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

      var path = svg.selectAll("path")
          .data(pie)
      	.enter()
      		.append("svg:path")
      		.attr("d", arc)
      		.style("fill", function(d, i) { return mycolors[i]; })
              .each(function(d) { this._current = d; }); // store the initial angles

      var titles = svg.append("svg:text")
      	.attr("class", "title")
      	.text(function(d,i) {return i;})
      	.attr("dy", "5px")
      	.attr("text-anchor", "middle")


      // -- Do the updates
      //------------------------
      setInterval(function() {
        change();
      }, 1000);


      function change() {
      	// Update the Pie charts with random data
      	var newdata = getDataInTime($scope.time);
        $scope.time = $scope.time + 1;
      	for(var x in newdata) {
      		var npath = d3.select("#pie"+x).selectAll("path").data(pie(newdata[x]))
      		npath.transition().duration(1000).attrTween("d", arcTween); // redraw the arcs
      	}

        var tdata = '<table class="table"><tbody>'

        var result = newdata.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);

        for( var i = 0; i< result.length; i++){
          tdata += '<tr><th scope="row" bgcolor="' + mycolors[i] + '">' + i + '</th><td>' + result[i] + '</td></tr>';
        }

        tdata += '</tbody></table>';

        $('#pieData').html(tdata)
          // temp, print new array to screen
          /*;
          for(var x in newdata) {

          }



          tdata += "<strong>"+colSum+":</strong> " + "<br>";

          */
      }

      function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }

    }
})();
