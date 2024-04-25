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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.21647727272727274, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.17916666666666667, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.09916666666666667, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.11333333333333333, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.17208333333333334, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.139375, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.18916666666666668, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.18604166666666666, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.17604166666666668, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.1425, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.8620833333333333, 500, 1500, "Home page "], "isController": false}, {"data": [0.12229166666666667, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26400, 0, 0.0, 2205.3614393939283, 98, 9636, 2714.0, 3850.0, 4083.0, 5170.850000000024, 84.1412808597709, 841.6435142440591, 27.623797640219532], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 2400, 0, 0.0, 2237.8241666666636, 142, 9636, 2240.0, 3661.6000000000004, 3857.0, 4451.909999999998, 7.760109158868835, 9.389428952967272, 2.5841769757561255], "isController": false}, {"data": ["Get tournamnent list ", 2400, 0, 0.0, 2655.6958333333373, 316, 7585, 2644.5, 4093.9, 4333.849999999999, 5890.469999999988, 8.06733535913088, 463.69058323473257, 3.064642045607336], "isController": false}, {"data": ["Get Players schedule", 2400, 0, 0.0, 2517.931249999996, 229, 8949, 2565.0, 3895.8, 4090.8999999999996, 4730.859999999997, 7.8160110987357605, 41.47664752965199, 2.5798942884498897], "isController": false}, {"data": ["Get Home page country ", 2400, 0, 0.0, 2282.3349999999964, 181, 8386, 2260.0, 3740.6000000000004, 3948.8499999999995, 5104.99, 8.212512447089178, 138.49040841637094, 2.566410139715368], "isController": false}, {"data": ["Get Break list ", 2400, 0, 0.0, 2442.4466666666667, 243, 8543, 2498.0, 3826.9, 4039.8999999999996, 4750.99, 7.8576199269241345, 24.70853141083566, 2.5936284524417554], "isController": false}, {"data": ["Get Home page currency", 2400, 0, 0.0, 2229.2354166666637, 114, 8422, 2241.5, 3643.0, 3828.0, 4548.799999999996, 8.00298778210532, 71.58017704213741, 2.508749099663875], "isController": false}, {"data": ["Get single knockout Player details", 2400, 0, 0.0, 2216.5845833333356, 98, 6392, 2221.0, 3612.7000000000003, 3809.8999999999996, 4480.859999999997, 7.766789209340859, 9.177553655568788, 2.4726301584425], "isController": false}, {"data": ["Get knockout players list ", 2400, 0, 0.0, 2258.7245833333327, 109, 8299, 2302.0, 3648.0, 3843.8499999999995, 4584.669999999993, 7.787580755590023, 34.960476760155494, 2.5857201727545], "isController": false}, {"data": ["Get Players list ", 2400, 0, 0.0, 2405.3695833333345, 178, 6660, 2451.0, 3815.9, 3999.749999999999, 4618.99, 7.915410644908083, 24.890256129496116, 2.6127039042763003], "isController": false}, {"data": ["Home page ", 2400, 0, 0.0, 524.4425000000007, 358, 2936, 456.0, 631.9000000000001, 899.6499999999987, 1944.8799999999974, 8.259627628454417, 24.464307223732664, 2.4924071652269677], "isController": false}, {"data": ["Get tournament result", 2400, 0, 0.0, 2488.386250000004, 321, 6768, 2493.5, 3912.8, 4100.95, 4701.879999999997, 7.74863430320406, 41.11916082895858, 2.5576546821122776], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
