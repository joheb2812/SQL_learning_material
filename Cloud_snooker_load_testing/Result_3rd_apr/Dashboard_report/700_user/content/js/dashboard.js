/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1927922077922078, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12357142857142857, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.09642857142857143, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.08214285714285714, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.19857142857142857, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.11928571428571429, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.17357142857142857, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.1, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.09928571428571428, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.13428571428571429, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.9328571428571428, 500, 1500, "Home page "], "isController": false}, {"data": [0.060714285714285714, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7700, 0, 0.0, 2409.329740259739, 111, 7907, 2427.0, 4139.900000000001, 4354.95, 5382.699999999993, 101.6233337732612, 1016.5863411681735, 33.36320031014914], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 700, 0, 0.0, 2397.0842857142843, 118, 6439, 2333.0, 4085.5, 4233.849999999999, 5788.4500000000035, 9.979613076144448, 12.074941993498994, 3.3232891200832584], "isController": false}, {"data": ["Get tournamnent list ", 700, 0, 0.0, 2898.8557142857135, 609, 7907, 2783.0, 4661.7, 4814.599999999999, 6822.620000000001, 12.202562538133009, 701.3732649481391, 4.635543776693106], "isController": false}, {"data": ["Get Players schedule", 700, 0, 0.0, 2869.3757142857153, 312, 6711, 3078.0, 4327.5, 4461.9, 5122.89, 10.386527190444394, 55.17978777171897, 3.428365420283404], "isController": false}, {"data": ["Get Home page country ", 700, 0, 0.0, 2273.135714285714, 208, 6495, 2220.0, 3954.5999999999995, 4248.349999999999, 5619.700000000001, 13.278700963654298, 223.9218761855983, 4.149594051141968], "isController": false}, {"data": ["Get Break list ", 700, 0, 0.0, 2691.832857142858, 180, 6488, 2945.0, 4185.0, 4279.0, 5352.64, 10.74938574938575, 33.780784513206385, 3.5481370930589677], "isController": false}, {"data": ["Get Home page currency", 700, 0, 0.0, 2442.8885714285725, 133, 6376, 2372.5, 4116.6, 4259.9, 5108.620000000003, 11.79463849433015, 105.49255976827749, 3.697342731132791], "isController": false}, {"data": ["Get single knockout Player details", 700, 0, 0.0, 2522.482857142856, 114, 6447, 2571.0, 4043.3999999999996, 4198.7, 5076.83, 9.956900843491743, 11.765478535766611, 3.1698727294710043], "isController": false}, {"data": ["Get knockout players list ", 700, 0, 0.0, 2589.1957142857163, 111, 7137, 2774.0, 4054.7999999999997, 4198.95, 5766.190000000005, 10.227638000058443, 45.91550258795769, 3.3958954297069055], "isController": false}, {"data": ["Get Players list ", 700, 0, 0.0, 2656.1157142857137, 191, 6387, 2898.5, 4189.7, 4293.95, 5930.120000000007, 11.221905158870115, 35.26571367308987, 3.7041054137676745], "isController": false}, {"data": ["Home page ", 700, 0, 0.0, 479.00714285714275, 365, 1852, 443.0, 513.0, 645.5499999999994, 1517.91, 14.011769886704831, 41.501658267945075, 4.228161030265423], "isController": false}, {"data": ["Get tournament result", 700, 0, 0.0, 2682.6528571428585, 294, 6258, 2616.0, 4277.999999999999, 4419.799999999999, 5590.84, 9.910943097028133, 52.65351674772402, 3.271385514448739], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7700, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
