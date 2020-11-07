const dataset = "data/circuitbreaker.csv";
const barCol = 'grey';
const hoveredBarCol = 'darkblue';
const viewRange = ["2020-04-07", "2020-06-01"];

let dateList = [];
let totalCasesList = [];
let newCasesList = [];
let deathList = [];

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
        }
    }];

    var layout = {
        xaxis: {
            range: viewRange
        },
        yaxis: {
            showgrid: false,
            zeroline: false

        },

        hovermode: "closest",
        plot_bgcolor: "gainsboro",
        paper_bgcolor: "gainsboro"
    }

    Plotly.newPlot('chart', traces, layout, { responsive: true });

    var plotDiv = document.getElementById("chart");

    plotDiv.on('plotly_hover', function (traces) {
        var index = traces.points[0].pointNumber,
            colors = [];

        updateNewCases(index);

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