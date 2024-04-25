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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.24547348484848486, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.20625, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.12875, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.14041666666666666, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.19770833333333335, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.1625, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.21145833333333333, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.20541666666666666, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.19645833333333335, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.16708333333333333, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.943125, 500, 1500, "Home page "], "isController": false}, {"data": [0.14104166666666668, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26400, 0, 0.0, 2451.3437878787768, 90, 9301, 3105.0, 4737.0, 4920.0, 5319.990000000002, 85.36672120651633, 853.9018619201368, 28.02611283928421], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 2400, 0, 0.0, 2518.951666666664, 119, 7367, 2466.5, 4550.8, 4768.95, 5035.779999999995, 7.827303591753936, 9.470731591975708, 2.606553246863371], "isController": false}, {"data": ["Get tournamnent list ", 2400, 0, 0.0, 2876.92083333333, 293, 7795, 2839.5, 4944.700000000001, 5129.0, 5392.939999999999, 8.250966910184786, 474.2452191663086, 3.134400515685432], "isController": false}, {"data": ["Get Players schedule", 2400, 0, 0.0, 2826.220416666666, 211, 9239, 2900.5, 4814.8, 5008.0, 5387.189999999982, 7.91483636075824, 42.00049653231232, 2.612514345640904], "isController": false}, {"data": ["Get Home page country ", 2400, 0, 0.0, 2524.5558333333397, 184, 7336, 2483.5, 4553.0, 4775.95, 5041.769999999995, 8.395072092681596, 141.56994775707284, 2.623460028962999], "isController": false}, {"data": ["Get Break list ", 2400, 0, 0.0, 2725.567083333339, 164, 7295, 2779.5, 4699.9, 4904.649999999999, 5123.859999999997, 7.976098292117954, 25.08109033263653, 2.632735569077996], "isController": false}, {"data": ["Get Home page currency", 2400, 0, 0.0, 2507.969999999999, 95, 9191, 2461.0, 4574.400000000001, 4737.95, 4943.889999999998, 8.159157974896992, 72.97750290138806, 2.55770479486517], "isController": false}, {"data": ["Get single knockout Player details", 2400, 0, 0.0, 2505.8254166666707, 90, 7235, 2514.5, 4508.6, 4714.849999999999, 4924.98, 7.826384699417913, 9.24797410771062, 2.4916029414162497], "isController": false}, {"data": ["Get knockout players list ", 2400, 0, 0.0, 2531.404166666664, 103, 7206, 2557.5, 4529.700000000001, 4710.0, 4918.969999999999, 7.835839169401048, 35.17649641061429, 2.6017434742151915], "isController": false}, {"data": ["Get Players list ", 2400, 0, 0.0, 2711.69125, 166, 7668, 2713.5, 4743.0, 4933.95, 5171.859999999997, 8.05834239896853, 25.33970949675652, 2.6598825496595353], "isController": false}, {"data": ["Home page ", 2400, 0, 0.0, 461.2375000000008, 347, 1750, 450.0, 504.0, 534.9499999999998, 828.9699999999993, 8.54235405921987, 25.301718614857293, 2.5777220745106835], "isController": false}, {"data": ["Get tournament result", 2400, 0, 0.0, 2774.4375000000027, 195, 9301, 2774.5, 4809.0, 5002.0, 5249.949999999999, 7.8241394261645745, 41.520278172607036, 2.582577271526979], "isController": false}]}, function(index, item){
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
