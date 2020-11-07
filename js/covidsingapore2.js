const barCol = 'grey';
const hoveredBarCol = 'darkblue';

let totalCasesList = [];
var newCasesList = [];
var deathList = [];

function updateNewCases(index) {
    document.getElementById("totalcases").innerHTML = totalCasesList[index];
    document.getElementById("newcases").innerHTML = newCasesList[index];
    document.getElementById("newdeaths").innerHTML = deathList[index];
};

function casesToZero(){
    document.getElementById("totalcases").innerHTML = 0;
    document.getElementById("newcases").innerHTML = 0;
    document.getElementById("newdeaths").innerHTML = 0;
}

function makeplot() {
    Plotly.d3.csv("data/circuitbreaker.csv", function (data) { 
        processData(data) 
    });

};

function processData(allRows) {

    var x = [], y = [];

    for (var i = 0; i < allRows.length; i++) {
        row = allRows[i];
        x.push(row['date']);
        y.push(row['new_cases']);
        totalCasesList.push(row['total_cases']);
        newCasesList.push(row['new_cases']);
        deathList.push(row['new_deaths']);
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
    	xaxis:{
    		autorange: true
    	},
        yaxis: {
            showgrid: false,
            zeroline: false
           
        },

        hovermode: "closest",
        title: "<b> New Cases in Singapore</b>",
        titlefont:{
            size: 32,
            //family: "Pathway Gothic One"
        },
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

        updateNewCases(pn);
        
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
        
        casesToZero();
        for (var i = 0; i < allRows.length; i++) {
            colors[i] = barCol;
        };

        var update={'marker':{color: colors}};
        Plotly.restyle('chart', update);
    });
};

makeplot();