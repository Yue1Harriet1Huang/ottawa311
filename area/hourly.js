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
var fix = 'seasonal'
function load_ward(ward){
    if (fix == 'seasonal'){
        datapath = 'area/wards_data/seasonal/'+ ward +'_seasonal.json'
    } else{
        datapath = 'area/wards_data/'+ ward +'.json'
    }
    var clean_data = [];
    d3.json(datapath, function(data) {
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

        if (fix == 'seasonal'){
            chart.xAxis
            .tickFormat(function(d) {
              return d3.time.format('%B')(new Date(d))
            });
        } else{
            chart.xAxis
            .tickFormat(function(d) {
              return d + ':00';
            });
        }

        d3.select('#chart svg')
          .datum(clean_data)
          .call(chart);

        chart.stacked.dispatch.on('areaClick', function(e){
            category = e.series;
            load_distribution(category);
        });

        //nv.utils.windowResize(chart.update);

        return chart;
      });
    })
}

var d;
function load_distribution(category){
  cat_data = [];
  d3.json('area/wards_data/type_distributions.json', function(data) {
      console.log(data)
      category = data[category];

      for (val in category){
          cat_data.push({'label': val, 'value': category[val]});
      }

      //Create Donut chart
      nv.addGraph(function() {

        var chart = nv.models.pieChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .showLabels(true)     //Display pie labels
          .showLegend(false)
          .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
          .labelType("key") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
          .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
          .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
          ;

        d3.select("#donut svg")
            .datum(cat_data)
            .transition().duration(350)
            .call(chart);

        return chart
      });
  });
}

$('#toggle').click(function(){
    if (fix == 'seasonal'){
        fix = '';
    } else{
        fix = 'seasonal';
    }
    load_ward('ALL')
});

load_ward('ALL')
load_distribution("Park Maintenance SAP")
