//change log:
//5 Aug 2015:  added red colors to match the MindTap blue colors


//color definitions

	var bStatblue = d3.rgb("#1f77b4");
	var bStatgreen = d3.rgb("#2ca02c");
	var bStatorange = d3.rgb("#ff7f0e");
	var bStatred = d3.rgb("#d62728");

//Mind Tap colors
	var mtDarkGray = d3.rgb("#2D2D2D");
	var mtMediumGray = d3.rgb("#5B5B5B");
	var mtLightGray = d3.rgb("#E5E5E5");

	var mtMediumBlue = d3.rgb("#1879B1");
	var mtLightBlue = d3.rgb("#3FB3E4");
	var mtDarkBlue = d3.rgb("#004071");
	var mtOrange = d3.rgb("#F87E00");
	var mtRed = d3.rgb("#B03F3B");

	var mtMediumRed = d3.rgb("#B03F3B");
	var mtLightRed = d3.rgb("#E43B3F");
	var mtDarkRed = d3.rgb("#710400");

	bStatgreen = mtDarkBlue;    // for the Cengage applets



//the jStat pdf functions fail for high df's
//these fake a derivative by computing the slope for a small difference of the cdf's,
//which seem accurate for high df's
//informal tests suggest this workaround is very accurate, certainly accurate enough
//for graphigng the pdf

function studenttpdf(t, df) {
	var d = 0.0001;
	var deriv = (jStat.studentt.cdf(t+d, df) - jStat.studentt.cdf(t-d, df))/(2*d);
	return deriv;
}

function centralFpdf(F, df1, df2) {
	var d = 0.0001;
	var deriv = (jStat.centralF.cdf(F+d, df1, df2) - jStat.centralF.cdf(F-d, df1, df2))/(2*d);
	return deriv;
}

//have trouble with Simple Stats slope function so make a simple one
function regressionSlope(xx,yy) {
	return jStat.covariance(xx,yy)/jStat.variance(xx);
}

//slider for Mind Tap applets
var Slider = function (sliderRef, textStart, initValue, updateFunction) {
	sliderSVG = d3.select(sliderRef);
	var textStart = textStart;
	initValue = initValue;
	sheight = sliderSVG.attr("height");
	swidth = sliderSVG.attr("width");


	var rounding = 0;

	grabRadius= 12;

	verticalPadding = 20;
	horizontalPadding = 63;
	textOffset = 37;
	var min = 1;
	var max = 100;


	var scale = d3.scale.linear()
		.domain([min, max])
		.range([horizontalPadding, swidth-horizontalPadding]);

	var axis = d3.svg.axis()
        .scale(scale)
        .ticks(3)
        .orient("bottom");

    var sliderAxis = sliderSVG.append("g")
    		.attr("class", "sliderAxis")
    		.attr("id", "sliderAxis")
    		.attr("transform", "translate(0," + (sheight - verticalPadding - 10) + ")")
    		.call(axis);

    sliderSVG
			.append("line")
			.attr("x1", horizontalPadding)
			.attr("x2", swidth - horizontalPadding)
			.attr("y1", sheight/2)
			.attr("y2", sheight/2)
			.style("stroke", mtDarkBlue)
			.style("stroke-width", 4);

	

	
	var	grabCircle = sliderSVG.append("circle")
    		.attr("id", "grabCircle")
			.attr("r", grabRadius)
			.attr("cx", scale(initValue))
			.attr("cy", sheight/2)
			.style("fill", mtDarkBlue)
			;

  	var drag = d3.behavior.drag()
			.on("dragstart", function(d) {grabCircle.style("fill", mtOrange);})
			.on("dragend", function(d) { grabCircle.style("fill", mtDarkBlue);})
			.on("drag", function(d) {grabCircle
	     //.attr("cx", Math.max(horizontalPadding+1, Math.min(width - horizontalPadding-grabRadius/2, d3.event.x)));  REPLACED BY
	     .attr("cx", Math.max(horizontalPadding+1, Math.min(swidth - horizontalPadding-grabRadius/2, d3.mouse(this)[0])));  //ADDED

	 		//sliderValue = d3.round(Math.max(min, Math.min(max, scale.invert(d3.event.x))),rounding);   REPLACED BY
	 		sliderValue = d3.round(Math.max(min, Math.min(max, scale.invert(d3.mouse(this)[0]))),rounding);    //ADDED

	 		sliderText
			.attr("x", scale(sliderValue)-textOffset)
			.text(textStart+sliderValue);
			updateFunction(sliderValue);});
	

	

		grabCircle.call(drag);  


		var sliderText = sliderSVG.append("text")
			.attr("x", scale(initValue)- textOffset)
			.attr("y", sheight/2 - grabRadius - 2)
			.attr("text-anchor", "middle")
			.style("fill", mtDarkBlue)
			.style("font-size", 18)
			.style("font-family", "sans-serif")
			.text(textStart+initValue);

		this.setDomain = function(newMin, newMax) {
			min = newMin;
			max = newMax;
			scale.domain([min,max]);
			axis.scale(scale);
			//sliderSVG.select("#sliderAxis").call(axis);
			sliderAxis.call(axis);
			grabCircle.attr("cx", scale(initValue));
			sliderText
				.attr("x", scale(initValue)-textOffset)
				.text(textStart+initValue);


		};

		this.getScaleValue = function(x) {
			return scale(x);

		}

		this.setRounding = function(rnd) {
			rounding = rnd;

			sliderText
				.attr("x", scale(initValue)-textOffset)
				.text(textStart+initValue);
			grabCircle
				.attr("cx", scale(initValue));
		}

		this.setTicks = function(nticks) {
			axis.ticks(nticks);
			//sliderSVG.select("#sliderAxis").call(axis);
			sliderAxis.call(axis);
		}


		}


