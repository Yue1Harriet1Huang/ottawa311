/*Data sample:
{
      "key" : "North America" ,
      "values" : [ [ 1025409600000 , 23.041422681023] , [ 1028088000000 , 19.854291255832],
       [ 1030766400000 , 21.02286281168],
       [ 1033358400000 , 22.093608385173],
       [ 1036040400000 , 25.108079299458],
       [ 1038632400000 , 26.982389242348]
       ...

*/

function load_ward(ward){
    var clean_data = [];
    d3.json('area/wards_data/'+ ward +'.json', function(data) {
      for (key in data){
          values = [];
          for (v in data[key]){
              values.push([parseInt(v), data[key][v]])
          }
          clean_data.push({'key': key, 'values': values})
      }

      nv.addGraph(function() {
        var chart = nv.models.stackedAreaChart()
                      .margin({right: 100})
                      .x(function(d) { return d[0] })   //We can modify the data accessor functions...
                      .y(function(d) { return d[1] })   //...in case your data is formatted differently.
                      .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                      .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                      .transitionDuration(500)
                      .showControls(false)
                      .clipEdge(true)
                      .style('stream');

        //Format x-axis labels with custom function.
        chart.xAxis
            .tickFormat(function(d) {
              return d + ':00';
        });

        chart.yAxis
            .tickFormat(d3.format(',.0f'));

        d3.select('#chart svg')
          .datum(clean_data)
          .call(chart);

        //nv.utils.windowResize(chart.update);

        return chart;
      });
    })
}

load_ward('ALL')
