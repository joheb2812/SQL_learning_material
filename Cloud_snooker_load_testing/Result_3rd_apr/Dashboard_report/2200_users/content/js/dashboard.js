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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2478099173553719, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2134090909090909, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.1365909090909091, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.14909090909090908, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.2075, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.17113636363636364, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.22227272727272726, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.21159090909090908, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.20113636363636364, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.17613636363636365, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.8920454545454546, 500, 1500, "Home page "], "isController": false}, {"data": [0.145, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24200, 0, 0.0, 2425.7235123966966, 98, 9875, 2781.5, 4790.9000000000015, 5009.0, 5828.900000000016, 83.82694239495653, 838.5022916017181, 27.52059951851467], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 2200, 0, 0.0, 2470.1922727272727, 116, 9715, 2391.5, 4555.9, 4856.95, 5183.849999999997, 7.689081504263945, 9.303488265413113, 2.560524211869146], "isController": false}, {"data": ["Get tournamnent list ", 2200, 0, 0.0, 2860.777272727274, 321, 7813, 2768.0, 5120.8, 5290.9, 6568.949999999999, 8.104683033214464, 465.8372068499308, 3.078829785078542], "isController": false}, {"data": ["Get Players schedule", 2200, 0, 0.0, 2789.1104545454514, 206, 9873, 2772.5, 4897.8, 5105.95, 5346.99, 7.774346071481578, 41.256689084906455, 2.566141574375755], "isController": false}, {"data": ["Get Home page country ", 2200, 0, 0.0, 2484.2722727272753, 192, 7682, 2375.5, 4565.0, 4922.95, 5826.749999999951, 8.331881566090757, 140.50498880285065, 2.6037129894033617], "isController": false}, {"data": ["Get Break list ", 2200, 0, 0.0, 2689.7318181818177, 186, 7506, 2654.0, 4773.8, 5015.849999999999, 5576.639999999992, 7.829153632905221, 24.619018259721496, 2.584232351486294], "isController": false}, {"data": ["Get Home page currency", 2200, 0, 0.0, 2462.3645454545454, 98, 7436, 2385.5, 4670.0, 4835.95, 5060.819999999996, 8.00008727367935, 71.55378484810743, 2.507839858252999], "isController": false}, {"data": ["Get single knockout Player details", 2200, 0, 0.0, 2480.1500000000015, 100, 7513, 2407.5, 4568.000000000003, 4833.0, 5206.669999999971, 7.713398172625851, 9.114464637575468, 2.455632621363308], "isController": false}, {"data": ["Get knockout players list ", 2200, 0, 0.0, 2534.795, 98, 8928, 2469.5, 4674.9000000000015, 4830.0, 6146.889999999998, 7.743806714584403, 34.76431259525762, 2.5711858232018527], "isController": false}, {"data": ["Get Players list ", 2200, 0, 0.0, 2680.9072727272724, 179, 9875, 2616.0, 4837.8, 5020.9, 5302.739999999994, 7.901419023025453, 24.84625903724801, 2.608085575959574], "isController": false}, {"data": ["Home page ", 2200, 0, 0.0, 496.0659090909096, 367, 7665, 467.0, 524.0, 554.9499999999998, 1396.8499999999967, 8.46626002963191, 25.07633463854842, 2.55476010659791], "isController": false}, {"data": ["Get tournament result", 2200, 0, 0.0, 2734.591818181819, 231, 7696, 2673.0, 4839.800000000001, 5106.0, 5330.699999999993, 7.686663638587051, 40.79084604617239, 2.537199521330492], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
