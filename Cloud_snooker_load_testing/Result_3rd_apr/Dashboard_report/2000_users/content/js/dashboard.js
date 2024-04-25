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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.27552272727272725, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.24825, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.1525, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.1645, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.25125, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.18875, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.24375, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.2555, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.2455, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.19325, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.9155, 500, 1500, "Home page "], "isController": false}, {"data": [0.172, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22000, 0, 0.0, 1923.3901818181798, 62, 8592, 2028.0, 3540.0, 3750.9500000000007, 4272.990000000002, 84.13548873158102, 841.7643606372116, 27.621896069725373], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 2000, 0, 0.0, 1931.6584999999995, 79, 6428, 1891.5, 3414.5000000000005, 3582.449999999998, 3961.7300000000005, 7.764186138598487, 9.39436193918313, 2.5855346418575036], "isController": false}, {"data": ["Get tournamnent list ", 2000, 0, 0.0, 2331.825999999998, 345, 8592, 2278.0, 3834.9, 3990.749999999999, 4609.76, 8.09867424702576, 465.67886251083195, 3.076547150481466], "isController": false}, {"data": ["Get Players schedule", 2000, 0, 0.0, 2225.5279999999984, 271, 6482, 2213.0, 3682.9, 3840.95, 5032.640000000002, 7.814942169427946, 41.471738299566276, 2.579541458268209], "isController": false}, {"data": ["Get Home page country ", 2000, 0, 0.0, 1913.8910000000003, 120, 5906, 1853.5, 3433.9, 3587.95, 4002.91, 8.258252058369326, 139.26214646939079, 2.580703768240414], "isController": false}, {"data": ["Get Break list ", 2000, 0, 0.0, 2122.1419999999976, 188, 6390, 2118.0, 3595.0, 3737.8999999999996, 4030.99, 7.863427982794819, 24.72679502402277, 2.595545564633446], "isController": false}, {"data": ["Get Home page currency", 2000, 0, 0.0, 1991.1645000000026, 62, 6975, 1924.0, 3488.0, 3698.749999999999, 4454.93, 7.991369321133176, 71.47658263450474, 2.5051069844567864], "isController": false}, {"data": ["Get single knockout Player details", 2000, 0, 0.0, 1909.1964999999973, 65, 6191, 1866.5, 3394.7000000000003, 3536.95, 3914.8500000000004, 7.772906756210552, 9.184782397475361, 2.474577736840469], "isController": false}, {"data": ["Get knockout players list ", 2000, 0, 0.0, 1948.9645000000044, 84, 6158, 1912.0, 3413.8, 3542.0, 3954.8900000000003, 7.796784606028474, 35.00147545011812, 2.5887761387203914], "isController": false}, {"data": ["Get Players list ", 2000, 0, 0.0, 2104.0139999999997, 132, 6061, 2073.0, 3601.9, 3740.95, 4152.6900000000005, 7.915306223409519, 24.88992777283071, 2.6126694370238446], "isController": false}, {"data": ["Home page ", 2000, 0, 0.0, 501.7904999999992, 236, 7685, 285.0, 713.9000000000001, 1475.8499999999995, 4247.8200000000015, 8.328891257995735, 24.669460142090887, 2.5133080065631663], "isController": false}, {"data": ["Get tournament result", 2000, 0, 0.0, 2177.1164999999964, 291, 6652, 2123.0, 3653.9, 3806.6499999999987, 4272.67, 7.757801439072167, 41.16887188233355, 2.5606805531312427], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
