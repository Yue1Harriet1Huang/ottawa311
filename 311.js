var w;
$(function() {
    var width = 500,
    height = 450;

    var projection = d3.geo.albers();

    var path = d3.geo.path()
    .projection(projection);

    var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

    d3.json("wardstopo.json", function(error, data) {
        var wards = topojson.feature(data, data.objects.wards);
        w = data;

        projection
        .scale(1)
        .translate([0, 0]);

        var b = path.bounds(wards),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

        projection
        .scale(s)
        .translate(t);

        svg.selectAll('.ward')
        .data(topojson.feature(data, data.objects.wards).features)
        .enter().append("path")
        .attr("class", function(d){ return 'ward ward' + d.properties.DESCRIPTIO})
        .attr("data-ward", function(d){ return d.properties.DESCRIPTIO})
        .attr("d", path)
        .append('svg:title')
        .text(function(d){return d.properties.DESCRIPTIO})

        svg.selectAll('.ward')
        .on('click', function(){ load_ward($(this).data('ward')) })

    });
});
