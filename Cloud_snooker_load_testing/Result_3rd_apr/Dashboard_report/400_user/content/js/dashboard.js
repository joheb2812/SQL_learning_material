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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10477272727272727, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11125, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.08125, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.005, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.25125, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.00875, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.07, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.01, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.00625, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.04375, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.55, 500, 1500, "Home page "], "isController": false}, {"data": [0.015, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4400, 0, 0.0, 2569.926363636362, 116, 7943, 2650.5, 4062.0, 4658.95, 5230.869999999997, 121.81279588051272, 1218.6754080469118, 39.991452340743606], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 400, 0, 0.0, 1984.115, 116, 4124, 1849.0, 3188.6000000000004, 3389.45, 3476.99, 20.03104812459312, 24.236785767940304, 6.670495518052982], "isController": false}, {"data": ["Get tournamnent list ", 400, 0, 0.0, 3263.442499999999, 669, 7943, 3310.0, 4834.6, 5177.5, 7179.300000000001, 20.94460152895591, 1203.843743454812, 7.956494135511572], "isController": false}, {"data": ["Get Players schedule", 400, 0, 0.0, 3328.594999999998, 850, 6148, 3294.5, 4386.6, 4729.0, 5158.010000000002, 15.075566275958241, 80.18095979534918, 4.976114649681528], "isController": false}, {"data": ["Get Home page country ", 400, 0, 0.0, 2122.4250000000006, 251, 6070, 1862.0, 4016.0, 4063.85, 5308.710000000002, 29.704440813901677, 500.89026297712763, 9.282637754344275], "isController": false}, {"data": ["Get Break list ", 400, 0, 0.0, 3192.0849999999996, 446, 6023, 3322.5, 4016.3000000000006, 4641.85, 5930.75, 15.264845061822623, 47.970968172798045, 5.03859143642192], "isController": false}, {"data": ["Get Home page currency", 400, 0, 0.0, 2849.1275000000005, 197, 6061, 3023.5, 4305.900000000001, 4611.75, 5969.300000000001, 18.363786612799558, 164.24501702954274, 5.7566167018639245], "isController": false}, {"data": ["Get single knockout Player details", 400, 0, 0.0, 2516.925000000001, 745, 4689, 2549.0, 3375.8, 4179.399999999996, 4667.93, 15.45177115926913, 18.25844052999575, 4.919216208907946], "isController": false}, {"data": ["Get knockout players list ", 400, 0, 0.0, 2841.960000000001, 457, 6071, 2918.0, 3712.1000000000045, 4374.599999999999, 4691.97, 15.177961599757152, 68.14015424603475, 5.039557562419367], "isController": false}, {"data": ["Get Players list ", 400, 0, 0.0, 3112.322500000001, 301, 6122, 3049.5, 4683.7, 4751.8, 6086.150000000001, 16.53370809738354, 51.95846939197288, 5.457415368081676], "isController": false}, {"data": ["Home page ", 400, 0, 0.0, 665.8374999999995, 387, 1550, 622.0, 938.9000000000001, 983.0, 1104.8200000000002, 47.09206498704968, 139.48264951730633, 14.210398516599954], "isController": false}, {"data": ["Get tournament result", 400, 0, 0.0, 2392.354999999998, 486, 4885, 2120.5, 3398.4000000000005, 3496.0, 4647.470000000002, 16.514594773130753, 87.83772668861731, 5.4511064778498], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
