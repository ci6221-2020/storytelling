const dataset = "data/circuitbreaker.csv";
const barCol = 'darkblue';
const hoveredBarCol = 'lightblue';
const viewRange = ["2020-04-07", "2020-06-01"];

const lineCol = 'darkslategrey';


let dateList = [];
let totalCasesList = [];
let newCasesList = [];
let deathList = [];
let totalDeathList = [];

function getDate(d) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(d);
    return date.getDate() + " " + monthNames[date.getMonth()];
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateNewCases(index) {
    document.getElementById("hovereddate").innerHTML = getDate(dateList[index]);
    document.getElementById("totalcases").innerHTML = numberWithCommas(totalCasesList[index]);
    document.getElementById("newcases").innerHTML = numberWithCommas(newCasesList[index]);
    document.getElementById("newdeaths").innerHTML = deathList[index];
};

function casesToZero() {
    document.getElementById("hovereddate").innerHTML = "-";
    document.getElementById("totalcases").innerHTML = "-";
    document.getElementById("newcases").innerHTML = "-";
    document.getElementById("newdeaths").innerHTML = "-";
}

function makeplot() {
    Plotly.d3.csv(dataset, function (data) {
        processData(data)
    });

};

function processData(allRows) {

    var x = [], y = [];

    for (var i = 0; i < allRows.length; i++) {
        row = allRows[i];
        x.push(row['date']);
        y.push(row['new_cases']);

        dateList.push(row['date']);
        totalCasesList.push(row['total_cases']);
        newCasesList.push(row['new_cases']);
        deathList.push(row['new_deaths']);
        //totalDeathList.push(row['total_deaths']);
    }
    makePlotly(x, y,allRows, totalCasesList);
}

function makePlotly(x, y,allRows, totalCasesList) {
    

    var traces = [{
        x: x,
        y: y,
        type: 'bar',
        name: "New Cases",
        marker: {
            color: barCol,
        },
        hovertemplate: '<b>Date:</b> <b> %{x|%d-%b}</b> <br><b>Cases: </b> <b> %{y:.0f}</b><extra></extra>'
    }];

    var traces2 = [{
        x:x,
        y:totalCasesList,
        type: 'scatter',
        name: "Total Cases",
        yaxis: 'y2',
        mode:'lines+markers',
        marker:{
            size:6
            },
        line:{
                color: lineCol
        },
        hovertemplate: '<b>Date:</b> <b> %{x|%d-%b}</b> <br><b>Total Cases: </b> <b> %{y:,.0f}</b><extra></extra>'
    }]

    var layout = {
        showlegend: true,
        legend:{
            orientation:"h"
        },
        xaxis:{
            title:{
                text:'<b>Date</b>',
                font:{
                    size:20,
                    color:'darkred'
                }
            },
            //rangeslider:{
                //range:viewRange,
                //thickness:0.12
                
            //},
            showgrid: false,
            zeroline: false,
            tickformat: '%d-%b'

    	},

        yaxis: {
            title:{
                text:"<b>New Cases</b>",
                font:{
                    color:barCol
                }
            },
            showgrid: false,
            zeroline: false,
            anchor: 'x'
        },
        yaxis2:{
            title:{
                text:"<b>Total Cases</b>",
                font:{
                    color:"darkslategrey"
                }
            },
            overlaying:'y',
            side: 'right',
            anchor: 'x',
            zeroline: false,
            showgrid:false,
            rangemode: "tozero",
        },
        hoverlabel:{
            bgcolor: "white",
            font:{
                size: 16
            }
        },
        hovermode: "unified",
        title: "<b> COVID-19 Cases in Singapore</b>",
        titlefont:{
            size: 32
        },
        plot_bgcolor: "gainsboro",
        paper_bgcolor: "gainsboro"
    }


    Plotly.newPlot('chart', [traces[0],traces2[0]], layout, {responsive:true});

    var plotDiv = document.getElementById("chart");

    plotDiv.on('plotly_hover', function (traces) {
        var index = traces.points[0].pointNumber,
            colors = [];

        updateNewCases(index);

        Plotly.Fx.hover('chart',[
            {curveNumber:0, pointNumber: index},
            {curveNumber:1, pointNumber: index}
        ]);
        
        for (var i = 0; i < allRows.length; i++) {
            colors[i] = barCol;
        };

        colors[index] = hoveredBarCol;
        var update = { 'marker': { color: colors } };
        Plotly.restyle('chart', update);
    })

    plotDiv.on('plotly_unhover', function (traces) {
        var index = traces.points[0].pointNumber,
            colors = [];

        casesToZero();

        for (var i = 0; i < allRows.length; i++) {
            colors[i] = barCol;
        };

        var update = { 'marker': { color: colors } };
        Plotly.restyle('chart', update);
    });
};

makeplot();