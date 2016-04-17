var dataSet = undefined;
var svg = undefined;

var draw = function(values) {
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
	
	if(svg == undefined) {
	 svg = d3.select('svg')
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}
	
	var xValue = function(d) {return d[d3.select('#sel-x').node().value];},
    xScale = d3.scale.linear()
	.domain([0, 50])
	.range([0, width]),
    xMap = function(d) {return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5);
	
	var yValue = function(d) {return d[d3.select('#sel-y').node().value];},
    yScale = d3.scale.linear().domain([0, 500]).range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
	
	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	  .append("text")
	  .attr("class", "label")
	  .attr("font-family", "Verdana")
	  .attr("font-size", "10")
	  .attr("id", "x-text")
	  .attr("x", width)
	  .attr("y", -6)
	  .style("text-anchor", "end")
      .text(d3.select('#sel-x').node().value);
	
	svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
	  .append("text")
	  .attr("class", "label")
	  .attr("font-family", "Verdana")
	  .attr("font-size", "10")
	  .attr("id", "y-text")
	  .attr("dy", ".71em")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .style("text-anchor", "end")
      .text(d3.select('#sel-y').node().value);
	  
	var circles = svg.selectAll('circle').data(values);
	
	circles.enter().append('circle');

	circles.attr("r", 2.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
	  .style("fill", "black")
	  .on('mouseover', function(d) {
		  var header = d3.select('#hovered').node();
		  header.textContent = d.name;
	  });

	circles.exit().remove();
};

var fillDropdowns = function(keys) {
	var indicesToRemove = [];
	var nameIndex = keys.indexOf('name');
	keys.splice(nameIndex, 1);
	var originIndex = keys.indexOf('origin');
	keys.splice(originIndex, 1);
	
	var xDD = d3.select('#sel-x');
	var yDD = d3.select('#sel-y');
	
	var allX = xDD.selectAll('option').data(keys);
	var allY = yDD.selectAll('option').data(keys.reverse());
	
	allX.enter().append('option');
	allY.enter().append('option');
	
	allX.attr('value', function(value, index) {
		allX[0][index].text = value;
		return value;
	});
	
	allY.attr('value', function(value, index) {
		allY[0][index].text = value;
		return value;
	});
};

var changeRendering = function() {
		var x = d3.select('#sel-x').node().value;
		var y = d3.select('#sel-y').node().value;

		d3.select('svg').selectAll(".x.axis").selectAll("text.label").text(x);
		d3.select('svg').selectAll(".y.axis").selectAll("text.label").text(y);
		
		if(x != y) {
			if(typeof dataSet == undefined) {
				renderData('car.csv');
			} else {
				draw(dataSet);
			}
		} else {
			alert("Invalid Inputs");
		}
};

var updateMpg = function() {
	if(dataSet == undefined) {
		alert("Data not loaded correctly");
	} else {
		var x = d3.select('#sel-x').node().value;
		var y = d3.select('#sel-y').node().value;
		
		var min = +d3.select("#mpg-min").node().value;
		var max = +d3.select("#mpg-max").node().value;
		
		if(x != "mpg" && y != "mpg") {
			alert("MPG Field not selected from the dropdown")
		} else {
			var data = []
			for(var i=0; i<dataSet.length; i++) {
				var value = +dataSet[i]["mpg"];
				if(value >= min && value <= max) {
					data.push(dataSet[i]);
				}
			}
			draw(data);
		}
	}
};

var renderData = function(fName) {
	d3.csv(fName, function(error, data) {
		dataSet = data;
		fillDropdowns(Object.keys(data[0]));
		draw(data);
	});
};

$(document).ready(function() {
	renderData('car.csv');
	
	d3.select('#sel-x')
	.on('change', changeRendering);
	
	d3.select('#sel-y')
	.on('change', changeRendering);
	
	d3.select('#update')
	.on("click", updateMpg);
});