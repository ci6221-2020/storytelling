const barCol = 'grey';
const hoveredBarCol = 'darkblue';

function makeplot() {
    Plotly.d3.csv("data/phase2.csv", function (data) { 
        processData(data) 
    });

};

function processData(allRows) {

    var x = [], y = [], standard_deviation = [];

    for (var i = 0; i < allRows.length; i++) {
        row = allRows[i];
        x.push(row['date']);
        y.push(row['new_cases']);
    }
    makePlotly(x, y, allRows);
}

function makePlotly(x, y, allRows) {
    var traces = [{
        x: x,
        y: y,
        type: 'bar',
        marker: {
            color: barCol,
            //opacity: '0.7'
        }
    }];

    var layout = {

        yaxis: {
            showgrid: false,
            zeroline: false
           
        },

        hovermode: "closest",
        title: "Total Cases in Singapore",
        plot_bgcolor: "gainsboro",
        paper_bgcolor: "gainsboro"
    }

    Plotly.newPlot('chart', traces, layout);

    var plotDiv = document.getElementById("chart");

    plotDiv.on('plotly_hover', function(traces){
        var pn ='',
            tn ='',
            colors = [];
        pn = traces.points[0].pointNumber;
        
        for (var i = 0; i < allRows.length; i++) {
            colors[i] = barCol;
        };

        colors[pn] = hoveredBarCol;
        var update={'marker':{color: colors}};
        Plotly.restyle('chart', update);
    })

    plotDiv.on('plotly_unhover', function(traces){
        var pn ='',
            tn ='',
            colors = [];

        pn = traces.points[0].pointNumber;
        
        for (var i = 0; i < allRows.length; i++) {
            colors[i] = barCol;
        };

        var update={'marker':{color: colors}};
        Plotly.restyle('chart', update);
    });
};

makeplot();