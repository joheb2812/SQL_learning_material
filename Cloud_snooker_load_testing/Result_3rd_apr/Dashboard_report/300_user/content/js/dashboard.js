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

    var data = {"OkPercent": 99.78787878787878, "KoPercent": 0.21212121212121213};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.046515151515151516, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.006666666666666667, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.0, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.24333333333333335, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.0, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.006666666666666667, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.0, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.0, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.0016666666666666668, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.25333333333333335, 500, 1500, "Home page "], "isController": false}, {"data": [0.0, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3300, 7, 0.21212121212121213, 11237.432424242435, 305, 39999, 8078.5, 26196.700000000004, 27856.049999999996, 28680.989999999998, 23.945317601985284, 268.946860102203, 7.861308992555183], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 300, 0, 0.0, 13900.906666666666, 1806, 30029, 15452.0, 17757.7, 17930.85, 18256.63, 6.6235400613781374, 8.415259394387654, 2.2056905868456496], "isController": false}, {"data": ["Get tournamnent list ", 300, 0, 0.0, 5397.616666666664, 1148, 10377, 5634.0, 7187.700000000001, 8227.949999999999, 9887.710000000003, 16.354121238552114, 1086.47901732174, 6.212649572067161], "isController": false}, {"data": ["Get Players schedule", 300, 1, 0.3333333333333333, 21673.426666666666, 8462, 39463, 21068.5, 28151.7, 28450.399999999998, 28781.260000000002, 3.566333808844508, 28.84470984531027, 1.1771687767475034], "isController": false}, {"data": ["Get Home page country ", 300, 0, 0.0, 2427.4933333333324, 305, 7361, 1915.5, 4814.9, 4860.65, 6132.56, 28.44950213371266, 479.7554750474158, 8.890469416785207], "isController": false}, {"data": ["Get Break list ", 300, 5, 1.6666666666666667, 23599.236666666668, 4444, 39999, 27302.5, 28631.2, 28757.85, 39949.54, 3.7466748260918434, 9.701716874711193, 1.2366954015810967], "isController": false}, {"data": ["Get Home page currency", 300, 0, 0.0, 6287.706666666665, 489, 21642, 6947.5, 8247.0, 8897.949999999999, 17422.990000000016, 7.730364873222016, 69.14172214813956, 2.423288207328386], "isController": false}, {"data": ["Get single knockout Player details", 300, 0, 0.0, 8236.103333333329, 1989, 25828, 5365.5, 17153.800000000003, 19434.549999999996, 23950.210000000003, 4.149090657630869, 4.902734077864601, 1.3209019085817024], "isController": false}, {"data": ["Get knockout players list ", 300, 0, 0.0, 13273.796666666662, 4402, 35305, 11753.5, 25339.400000000005, 26740.1, 27863.890000000003, 3.6595184073775893, 16.428843237667426, 1.2150744711995902], "isController": false}, {"data": ["Get Players list ", 300, 1, 0.3333333333333333, 15764.803333333331, 1461, 32059, 15585.0, 27422.8, 28383.949999999997, 28925.66, 4.680479281078382, 12.231012611941463, 1.5449238251997004], "isController": false}, {"data": ["Home page ", 300, 0, 0.0, 1481.2000000000003, 596, 3955, 1494.0, 2127.4, 2455.9, 2532.6900000000005, 52.97545470598622, 156.9087442609924, 15.985757328271234], "isController": false}, {"data": ["Get tournament result", 300, 0, 0.0, 11569.466666666667, 5105, 18467, 11396.5, 17792.6, 17983.85, 18294.96, 4.878286745694912, 39.57548234060198, 1.6102157422313284], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 7, 100.0, 0.21212121212121213], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3300, 7, "400", 7, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Players schedule", 300, 1, "400", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Break list ", 300, 5, "400", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Players list ", 300, 1, "400", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
