/*!
 voltmeter
 */

    function waterTankGaugeDefaultSettings(){
        return{

        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        rectangleThickness: 0, // The outer circle thickness as a percentage of it's radius.
        rectangleFillGap: 0.00, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        rectangleColor: "white", // The color of the outer circle.
        backgroundColor:"none", // The color of the background
        waveColor: "#6495ed", // The color of the fill wave.
        waveHeight: 0.02, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 12, // The number of full waves per width of the wave circle.
        waveOffset: 1, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveRiseAtStart: true, // If set to false and waveRise at true, will disable only the initial animation
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveAnimateTime: 1000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading and updating. If false, the final value is displayed.
        valueCountUpAtStart: true, // If set to false and valueCountUp at true, will disable only the initial animation
        textVertPosition: 0.6, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 0.6, // The relative height of the text to display in the wave circle. 1 = 50%
        displayPercent: true, // If true, a % symbol is displayed after the value.

      };
    }

    function loadWaterTankMeterGauge (elementId, value, config) {
        // Handle configuration
        // value = value - 50
         if(config == null) config = tempretureMeterGaugeDefaultSettings();
            var gauge = d3.select("#" + elementId);
            var width = parseInt(gauge.style("width"));
            var height = parseInt(gauge.style("height"));
            var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;

            //var width = config.width !== 0 ? config.width : parseInt(gauge.style("width"));
            //var height = config.height !== 0 ? config.height : parseInt(gauge.style("height"));
            var rectangleWidth = width / 4;
            var rectangleHeight = height / 2;
            var locationX = width-400;
            var locationY = height-340;
            var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
            var waveHeightScale;
            if (config.waveHeightScaling) {
                waveHeightScale = d3.scale.linear()
                    .range([0, config.waveHeight, 0])
                    .domain([0, 50, 100]);
            } else {
                waveHeightScale = d3.scale.linear()
                    .range([config.waveHeight, config.waveHeight])
                    .domain([0, 100]);
            }

            var textPixels = (config.textSize * rectangleWidth / 2);
            var textFinalValue = parseFloat(value).toFixed(2);
            var textStartValue = config.valueCountUp? config.minValue: textFinalValue;
            var percentText = config.displayPercent ? "\u00B0"+"C" : ""; //\u00B0=for degrees
            var rectangleThickness = config.rectangleThickness* rectangleWidth;
            var rectangleFillGap = config.rectangleFillGap* rectangleWidth;
            var fillRectangleMargin = rectangleThickness + rectangleFillGap;
            var fillRectangleRadius = width - fillRectangleMargin;
            var waveHeight = fillRectangleRadius * waveHeightScale(fillPercent * 100);
            var waveLength = fillRectangleRadius * 2 / config.waveCount;
            var waveClipCount = 1 + config.waveCount;
            var waveClipWidth = waveLength * waveClipCount;
            // console.log('waveHeight', waveHeight);
            // console.log('waveLength', waveLength);
            // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
            var textRounder = function(value) {
                return Math.round(value);
            };
            if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
                textRounder = function(value) {
                    return parseFloat(value).toFixed(2);
                };
            }
            if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
                textRounder = function(value) {
                    return parseFloat(value).toFixed(2);
                };
            }

            // Data for building the clip wave area.
            var data = [];
            for (var i = 0; i <= 40 * waveClipCount; i++) {
                data.push({
                    x: i / (40 * waveClipCount),
                    y: (i / (40))
                });
            }

            // Scales for controlling the size of the clipping path.
            var waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
            var waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

            // Scales for controlling the position of the clipping path.
            var waveRiseScale = d3.scale.linear()
                // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                // such that the it will won't overlap the fill circle at all when at 0%, and will totally cover the fill
                // circle at 100%.
            .range([275,40])
            .domain([0,1]);

            var waveAnimateScale = d3.scale.linear()
            .range([0, waveClipWidth-fillRectangleRadius*2]) // Push the clip area one full wave then snap back.
            .domain([0,1]);
            // console.log('warwe',waveAnimateScale);
            // Scale for controlling the position of the text within the gauge.
            var textRiseScaleY = d3.scale.linear()
                .range([fillRectangleMargin + fillRectangleRadius * 2, (fillRectangleMargin + textPixels * 0.7)])
                .domain([0, 1]);

            // Center the gauge within the parent SVG.
            //traslating with hardcoded values
            var gaugeGroup = gauge.append("g")
            .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

            // Draw the background circle
            if (config.backgroundColor) {
                 gaugeGroup.append("path")
                 .attr("d","M105 40 L105,75 A1,-1.25 0 0,0  105,90 L105,110 A1,-1.45 0 0,0  105,128 L105,152 A1,-1.42 0 0,0  105,170 L105,190 A1,-1.52 0 0,0  105,210 L105,235 A1,-1.81 0 0,0  105,258 L105,275 A75,20 0 0,0  350,275 L350 258 A1,-1.81 0 0,0  350,235  L350 210 A1,-1.52 0 0,0  350,190 L350 170 A1,-1.42 0 0,0  350,152 L350 128 A1,-1.45 0 0,0  350,110 L350 90 A1,-1.25 0 0,0  350,75 L350,40 Q321 9, 270,10 L270 -2 A75,20 0 0,0  180 -2 L180 10 Q140 9, 104,41")
                    // .attr("d","M105 40 L105,175 A35,35 0 1,0  145,175 L145,40 A20,20 0 0,0 105,40")
                    // d="M-6.547-171.285c-0.276,0-0.5-0.224-0.5-0.5v-2.569c0-0.081-0.065-0.146-0.146-0.146h-7.592 c-0.08,0-0.145,0.065-0.145,0.146v2.569c0,0.276-0.224,0.5-0.5,0.5s-0.5-0.224-0.5-0.5v-2.569c0-0.632,0.514-1.146,1.145-1.146 h7.592c0.632,0,1.146,0.514,1.146,1.146v2.569C-6.047-171.509-6.271-171.285-6.547-171.285z"
                    .style("fill", config.backgroundColor)
                    .style("stroke","#08080b")
                    .style("stroke-width","3px");
            }
            // <path d="M105 40 L105,75 A1,-1.25 0 0,0  105,90 L105,110 A1,-1.45 0 0,0  105,128 L105,152 A1,-1.42 0 0,0  105,170 L105,190 A1,-1.52 0 0,0  105,210 L105,235 A1,-1.81 0 0,0  105,258 L105,275 A75,20 0 0,0  350,275 L350 258 A1,-1.81 0 0,0  350,235  L350 210 A1,-1.52 0 0,0  350,190 L350 170 A1,-1.42 0 0,0  350,152 L350 128 A1,-1.45 0 0,0  350,110 L350 90 A1,-1.25 0 0,0  350,75 L350,40 Q321 9, 270,10 L270 -2 A75,20 0 0,0  180 -2 L180 10 Q140 9, 103.8,42" style="fill: none; stroke: rgb(12, 71, 149); stroke-width: 5px;"></path>
//code to be uncomment
            //lines
            gaugeGroup.append("path")
            .attr("d","M106 41 Q220 70 349,41")
            .style("fill", config.backgroundColor)
            .style("stroke","black")
            .style("stroke-width","1px");
            gaugeGroup.append("path")
            .attr("d","M180 10 Q220 20 270,10")
            .style("fill", config.backgroundColor)
            .style("stroke","black")
            .style("stroke-width","1px");
            // gaugeGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","145")
            // .attr("x2","125")
            // .attr("y2","145")
            // .style("stroke","black")
            // .style("stroke-width","1px");
            // gaugeGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","125")
            // .attr("x2","125")
            // .attr("y2","125")
            // .style("stroke","black")
            // .style("stroke-width","1px");
            // gaugeGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","105")
            // .attr("x2","125")
            // .attr("y2","105")
            // .style("stroke","black")
            // .style("stroke-width","1px");
            // gaugeGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","85")
            // .attr("x2","125")
            // .attr("y2","85")
            // .style("stroke","black")
            // .style("stroke-width","1px");
            //
            // gaugeGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","65")
            // .attr("x2","125")
            // .attr("y2","65")
            // .style("stroke","black")
            // .style("stroke-width","1px");
            //
            // var section = config.maxValue/5
            // var i = 0
            // var y = 170
            // var j = 0
            // while(j<6){
            //   gaugeGroup.append("text")
            //   .attr("x","82")
            //   .attr("y",y)
            //   .text( function (d) { return i; })
            //   .attr("font-size","15px");
            //
            //   y=y-20
            //   i=i+section
            //   j++
            // }

            // gaugeGroup.append("text")
            // .attr("x","82")
            // .attr("y","170")
            // .text( function (d) { return "0"; })
            // .attr("font-size","15px");
            //
            // gaugeGroup.append("text")
            // .attr("x","82")
            // .attr("y","150")
            // .text( function (d) { return "10"; })
            // .attr("font-size","15px");
            //
            // gaugeGroup.append("text")
            // .attr("x","82")
            // .attr("y","130")
            // .text( function (d) { return "20"; })
            // .attr("font-size","15px");
            //
            // gaugeGroup.append("text")
            // .attr("x","82")
            // .attr("y","110")
            // .text( function (d) { return "30"; })
            // .attr("font-size","15px");
            //
            //
            // gaugeGroup.append("text")
            // .attr("x","82")
            // .attr("y","90")
            // .text( function (d) { return "40"; })
            // .attr("font-size","15px");
            //
            //
            // gaugeGroup.append("text")
            // .attr("x","82")
            // .attr("y","70")
            // .text( function (d) { return "50"; })
            // .attr("font-size","15px");


            // Text where the wave does not overlap.
            var text1 = gaugeGroup.append("text")
                .attr("class", "liquidFillGaugeText")
                .attr("text-anchor", "middle")
                .style("display","none" )
                .attr("font-size", textPixels + "px")
                .style("fill","black")
                .attr('transform', 'translate(' + (locationX+197) + ',' + textRiseScaleY(config.textVertPosition) + ')');


// <path d="M105 40 L105,275 A75,20 0 0,0  350,275 L350 40 Q321 9, 270,10 L270 -2 A75,20 0 0,0  180 -2 L180 10 Q140 9, 103.8,42" style="fill: none; stroke: rgb(12, 71, 149); stroke-width: 5px;"></path>

            //The clipping wave area.
            var clipArea = d3.svg.area()
                .x(function(d) {
                    return waveScaleX(d.x);
                    // return waveScaleX(d.y);
                })
                .y0(function(d) {
                  // console.log('y', d);
                  return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset* -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI));
                    // return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset* -1 + Math.PI * 2 * (1 - config.waveCount) + 0 * 2 * Math.PI));
                    // return 0;
                })
                .y1(function(d) {
                  // console.log('clipArea1', fillRectangleRadius);
                    return (fillRectangleRadius * 2 + waveHeight);
                    // return (275);
                });
            var waveGroup = gaugeGroup.append("defs")
                .append("clipPath")
                .attr("id","clipWave"+elementId);

            var wave = waveGroup.append("path")
                .datum(data)
                .attr("d", clipArea)
                .attr("T", 0);


            //The inner circle with the clipping wave attached.
            var fillCircleGroup = gaugeGroup.append("g")
            .attr("clip-path", "url(#clipWave" + elementId + ")");

                fillCircleGroup.append("path")
                // .attr("d","M110 40 L110,177.5 A30,30 0 1,0  140,177.5 L140,40 A15,15 0 0,0 110,40")
                .attr("d","M110 40 L110,75 A1,-1.25 0 0,0  110,90 L110,110 A1,-1.45 0 0,0  110,128 L110,152 A1,-1.42 0 0,0  110,170 L110,190 A1,-1.52 0 0,0  110,210 L110,235 A1,-1.81 0 0,0  110,258 L110,275 A75,17 0 0,0  345,275 L345 258 A1,-1.81 0 0,0  345,235  L345 210 A1,-1.52 0 0,0  345,190 L345 170 A1,-1.42 0 0,0  345,152 L345 128 A1,-1.45 0 0,0  345,110 L345 90 A1,-1.25 0 0,0  345,75 L345,45 Q321 16, 265,16 L265 2 A75,20 0 0,0  185 2 L185 16 Q144 12, 115,38")
                .style("fill",config.waveColor)

                   // Text where the wave does overlap.
            var text2 = fillCircleGroup.append("text")
                .attr("class", "liquidFillGaugeText")
                .attr("text-anchor", "middle")
                .attr("font-size", textPixels + "px")
                .style("fill","white")
                .style("display","none")
                .attr('transform', 'translate(' + (locationX+97) + ',' + textRiseScaleY(config.textVertPosition) + ')');

                fillCircleGroup.append("path")
                .attr("d","M106.9 90 Q230 110 348,90")
                .style("fill", config.backgroundColor)
                .style("stroke","white")
                .style("stroke-width","2px");
                fillCircleGroup.append("path")
                .attr("d","M106.9 128 Q230 145 348,128")
                .style("fill", config.backgroundColor)
                .style("stroke","white")
                .style("stroke-width","2px");
                fillCircleGroup.append("path")
                .attr("d","M106.9 170 Q230 185 348,170")
                .style("fill", config.backgroundColor)
                .style("stroke","white")
                .style("stroke-width","2px");
                fillCircleGroup.append("path")
                .attr("d","M106.9 210 Q230 225 348,210")
                .style("fill", config.backgroundColor)
                .style("stroke","white")
                .style("stroke-width","2px");
                fillCircleGroup.append("path")
                .attr("d","M106.9 258 Q230 275 348,258")
                .style("fill", config.backgroundColor)
                .style("stroke","white")
                .style("stroke-width","2px");
                fillCircleGroup.append("path")
                .attr("d","M106.9 40 Q220 70 348,40")
                .style("fill", config.backgroundColor)
                .style("stroke","white")
                .style("stroke-width","2px");
            // fillCircleGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","165")
            // .attr("x2","125")
            // .attr("y2","165")
            // .style("stroke","white")
            // .style("stroke-width","2px");
            // fillCircleGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","145")
            // .attr("x2","125")
            // .attr("y2","145")
            // .style("stroke","white")
            // .style("stroke-width","2px");
            // fillCircleGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","125")
            // .attr("x2","125")
            // .attr("y2","125")
            // .style("stroke","white")
            // .style("stroke-width","2px");
            // fillCircleGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","105")
            // .attr("x2","125")
            // .attr("y2","105")
            // .style("stroke","white")
            // .style("stroke-width","2px");
            // fillCircleGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","85")
            // .attr("x2","125")
            // .attr("y2","85")
            // .style("stroke","white")
            // .style("stroke-width","2px");
            // fillCircleGroup.append("line")
            // .attr("x1","105")
            // .attr("y1","65")
            // .attr("x2","125")
            // .attr("y2","65")
            // .style("stroke","white")
            // .style("stroke-width","2px");
            //

                if(config.valueCountUp){
                var textTween = function(){
                var i = d3.interpolate(this.textContent, textFinalValue);
                return function(t) { this.textContent = textRounder(i(t)) + percentText; }
                 };
                    text1.transition()
                    .duration(config.waveRiseTime)
                    .tween("text", textTween);
                    text2.transition()
                    .duration(config.waveRiseTime)
                    .tween("text", textTween);
                }


   //Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillRectangleMargin + fillRectangleRadius * 2 - waveClipWidth;

    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate)
     animateWave();

    function animateWave() {
      // console.log('animate');
        wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
        wave.transition()
            .duration(config.waveAnimateTime * (1-wave.attr('T')))
            .ease('linear')
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .attr('T', 1)
            .each('end', function(){
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }

    function GaugeUpdater(){
        this.update = function(value){
            var newFinalValue = parseFloat(value).toFixed(2);
            var textRounderUpdater = function(value){ return Math.round(value); };
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
            }
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
            }

            var textTween = function(){
                var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
            };

            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);

            var fillPercent = (Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue)*(config.maxValue-config.minValue)/100 + 0.2
            // var waveHeight = fillRectangleRadius*waveHeightScale(fillPercent*100);
            var waveHeight = 0.1
            var waveRiseScale = d3.scale.linear()
                // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
                // circle at 100%.
                .range([340,100])
                .domain([0,1]);
            var newHeight = waveRiseScale(fillPercent);
            var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
            var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);
            var newClipArea;
            if(config.waveHeightScaling){
                newClipArea = d3.svg.area()
                    .x(function(d) { return waveScaleX(d.x); } )
                    .y0(function(d) { return waveScaleY((Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI))*50 + 10);} )
                    .y1(function(d) { return (fillRectangleRadius*2 + waveHeight); } );
            } else {
                newClipArea = clipArea;
            }

            var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
            wave.transition()
                .duration(0)
                .transition()
                .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
                .ease('linear')
                .attr('d', newClipArea)
                .attr('transform','translate('+newWavePosition+',0)')
                .attr('T','1')
                .each("end", function(){
                    if(config.waveAnimate){
                        wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                        animateWave(config.waveAnimateTime);
                    }
                });
            waveGroup.transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+newHeight+')')
        }
    }

    return new GaugeUpdater();
}
