//template.js  for illustrating basic d3 graphing

//get svg object and its size from the webpage
var canvas = d3.select('#canvas'); //select DOM object with id 'canvas'
var width = canvas.attr('width'); //use the getter method for attributes
var height = canvas.attr('height');

//drawing this rectangle illustrates creation of basic shapes and outlines
//the graphing area as we develop the graph.

canvas.append('rect') //append places the rect on the object canvas
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', width)
  .attr('height', height)
  .style('fill', 'none') //any css can be put here or in the common.css file
  .style('stroke', 'black')
  .style('stroke-width', 2);

//it is often useful to have some margins so that the graph is not directly up against
//screen boundaries or text above and below.  margins also help leave room for axes and labels
//I often need to mess with margins as the graph develops.  This uses json format

var margin = { 'left': 40, 'right': 20, 'top': 20, 'bottom': 30 };

//see http://bl.ocks.org/mbostock/3019563 for a useful margin diagram

//a little bit of data.  these can be hard-coded in js or read from csv, tsv, or json files.

var ourData = [{ 'x': 2, 'y': 3 }, { 'x': 5, 'y': 5 }, { 'x': 2, 'y': 9 }, { 'x': 8, 'y': 3 }];

//one of the big problems of computer graphing is translating data values to/from pixels.
//this is not helped by the non-Cartesian engineer who decided 0,0 would be in the upper left corner
//fortunately d3 makes it easy to create scales to do the translation.  I'm using linear scales
//but there are many mathematically-interesting alternatives in d3.  (e.g., power, log, quantile,
//threshold).  see https://github.com/mbostock/d3/wiki/Quantitative-Scales

var xScale = d3.scaleLinear()
  .domain([0, 10]) //can be hand-coded or obtained from range of ourData as below
  //  .domain([0, d3.max(ourData, function(d) {return d.x;})])
  .range([margin.left, width - margin.right]);


var yScale = d3.scaleLinear()
  .domain([0, 10])
  .range([height - margin.bottom, margin.top]); //note the magic reversal of range
//that solves the problem of (0,0) being in upper left corner


//now let's plot the points on the canvas
//some magic things happen here

var myDots = canvas.selectAll('myDots')
  .data(ourData) // binds the ourData to myDots, so the following is automatically applied to all data
  .enter() // you can also .exit() data from a display
  .append('circle')
  .attr('cx', function(d) { return xScale(d.x); }) //accessor function for scaled x value
  .attr('cy', function(d) { return yScale(d.y); })
  .attr('r', 20)
  .style('stroke', 'Black') //any relevant css styles may be specified
  .style('stroke-width', 1)
  .style('opacity', 0.7)
  .style('fill', 'Black');

//now we will attach to all the objects in myDots the dragging instructions

myDots
  .call(d3.drag().on('start', dragstarted).on('drag', dragmove)
    .on('end', dragended)); //not all functions need to be specified

function dragstarted(d, i) { //d and i are the data values and index of the dot being dragged
  //turn dot blue if it is being dragged
  d3.select(this).style('fill', 'White');

}

function dragmove(d, i) { //move the center of the dot to cursor location

  d3.select(this).attr('cx', d3.mouse(this)[0]) //d3 uses selection a lot.  this refers to whatever is being dragged
    .attr('cy', d3.mouse(this)[1]); //once we have selected it, then we can change its location and style
}

function dragended(d, i) { //when dragging done, turn dot back to red
  d3.select(this).style('fill', 'Black');
}

//create axes (if desired/needed)
var xAxis = d3.axisBottom() //creates a bottom axis but does not display it
  .scale(xScale)
  .ticks(6); //lots of options for controlling ticks, etc.  see API


//now display the  axis by putting it on a generic object and then transforming
//the location of that opbject.  this takes some getting used to

canvas.append('g')
  .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
  .attr('class', 'axis') //this signifies an axis for css purposes
  .call(xAxis);

var yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(6);

canvas.append("g")
  .attr("transform", "translate(" + margin.left + ",0)")
  .attr('class', 'axis')
  .call(yAxis);
