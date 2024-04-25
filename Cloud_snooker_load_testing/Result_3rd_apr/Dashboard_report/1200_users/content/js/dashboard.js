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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.325, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.30833333333333335, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.17541666666666667, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.21541666666666667, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.3329166666666667, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.28041666666666665, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.2991666666666667, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.31125, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.2825, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.28458333333333335, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.8679166666666667, 500, 1500, "Home page "], "isController": false}, {"data": [0.21708333333333332, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13200, 0, 0.0, 1699.589696969698, 63, 7997, 1617.5, 3093.0, 3548.899999999998, 4807.99, 100.7149233574693, 1007.7180350527991, 33.064966848004396], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 1200, 0, 0.0, 1662.0749999999994, 102, 6461, 1596.5, 2897.7000000000003, 3398.95, 4457.290000000002, 9.3745605674734, 11.342852092870647, 3.1218019077230754], "isController": false}, {"data": ["Get tournamnent list ", 1200, 0, 0.0, 2144.1141666666676, 402, 7680, 2029.0, 3542.7000000000003, 3899.8, 5269.74, 10.233930596894002, 588.4649593814229, 3.887694338077897], "isController": false}, {"data": ["Get Players schedule", 1200, 0, 0.0, 1953.2416666666666, 168, 6029, 1938.0, 3172.9, 3697.8500000000004, 4978.360000000001, 9.560077117955418, 50.78706944798521, 3.155572329950128], "isController": false}, {"data": ["Get Home page country ", 1200, 0, 0.0, 1626.6016666666662, 137, 5261, 1572.0, 2884.9, 3337.9, 4612.87, 10.523177297998842, 177.4598714802164, 3.288492905624638], "isController": false}, {"data": ["Get Break list ", 1200, 0, 0.0, 1772.7824999999998, 124, 5319, 1736.0, 3077.000000000001, 3493.9, 4341.82, 9.692505270299742, 30.45945503889118, 3.1992839661731565], "isController": false}, {"data": ["Get Home page currency", 1200, 0, 0.0, 1728.3058333333338, 72, 7071, 1632.0, 3176.8, 3545.3000000000015, 4751.93, 10.043269753856197, 89.82834345419431, 3.1483296786990618], "isController": false}, {"data": ["Get single knockout Player details", 1200, 0, 0.0, 1668.842499999999, 63, 5692, 1643.5, 2892.7000000000003, 3334.6500000000015, 4682.83, 9.398349023354898, 11.10547101392522, 2.9920525211071256], "isController": false}, {"data": ["Get knockout players list ", 1200, 0, 0.0, 1743.5900000000017, 67, 6680, 1737.0, 2964.7000000000003, 3415.700000000001, 4774.88, 9.477475200606559, 42.54615086166045, 3.1468179377013965], "isController": false}, {"data": ["Get Players list ", 1200, 0, 0.0, 1758.845833333332, 120, 6230, 1730.0, 3024.0, 3414.900000000001, 4769.680000000001, 9.8603932653514, 30.98705617959063, 3.2547001207898174], "isController": false}, {"data": ["Home page ", 1200, 0, 0.0, 721.4274999999997, 242, 7997, 351.0, 1408.6000000000004, 3287.250000000001, 7587.99, 10.845006778129237, 32.1219780840488, 3.272565521915951], "isController": false}, {"data": ["Get tournament result", 1200, 0, 0.0, 1915.660000000001, 278, 5651, 1871.5, 3136.9, 3616.8, 4574.67, 9.362200117027502, 49.73801382387361, 3.090257460503218], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
