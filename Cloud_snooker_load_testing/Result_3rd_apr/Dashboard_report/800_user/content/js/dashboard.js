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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23454545454545456, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2075, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.11125, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.126875, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.23125, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.17125, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.225, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.1775, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.165, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.18375, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.870625, 500, 1500, "Home page "], "isController": false}, {"data": [0.11, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8800, 0, 0.0, 2276.4181818181805, 102, 8451, 2299.5, 4025.0, 4235.0, 5344.909999999998, 102.60835092056014, 1026.4389126867063, 33.68658395811713], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 800, 0, 0.0, 2260.651250000002, 145, 6217, 2168.0, 3951.4999999999995, 4134.849999999999, 5189.840000000001, 9.655189060670795, 11.682401607588979, 3.215253388367911], "isController": false}, {"data": ["Get tournamnent list ", 800, 0, 0.0, 2769.7337500000026, 497, 8451, 2665.0, 4510.8, 4719.75, 6089.68, 11.593026794383178, 666.3386504267683, 4.403991624038141], "isController": false}, {"data": ["Get Players schedule", 800, 0, 0.0, 2693.2699999999986, 279, 8006, 2913.0, 4165.7, 4349.849999999999, 5739.830000000001, 9.888507082643198, 52.53365955106178, 3.263979876888087], "isController": false}, {"data": ["Get Home page country ", 800, 0, 0.0, 2191.87875, 185, 8056, 2135.0, 3768.9, 4261.349999999999, 5965.480000000003, 12.454269479255858, 210.02091319957967, 3.8919592122674556], "isController": false}, {"data": ["Get Break list ", 800, 0, 0.0, 2534.0012500000016, 132, 7660, 2869.5, 4063.9, 4233.9, 5828.010000000004, 10.283966011492332, 32.3181666259593, 3.3945122186371175], "isController": false}, {"data": ["Get Home page currency", 800, 0, 0.0, 2312.522500000002, 103, 6146, 2256.5, 4015.2, 4171.9, 5344.72, 11.177555468619014, 99.97230444080786, 3.5039016654557646], "isController": false}, {"data": ["Get single knockout Player details", 800, 0, 0.0, 2365.0387499999965, 102, 6068, 2482.0, 3940.7999999999997, 4094.0, 4870.280000000001, 9.655655196552932, 11.409514441239304, 3.0739683535900935], "isController": false}, {"data": ["Get knockout players list ", 800, 0, 0.0, 2430.3975000000005, 109, 6239, 2593.0, 3931.8, 4109.499999999999, 5606.270000000003, 9.760382606998194, 43.81698110222171, 3.240752037479869], "isController": false}, {"data": ["Get Players list ", 800, 0, 0.0, 2473.898749999999, 128, 7761, 2732.5, 4067.6, 4221.0999999999985, 5346.150000000001, 10.720555324765824, 33.69018265146134, 3.5386208005574686], "isController": false}, {"data": ["Home page ", 800, 0, 0.0, 489.09500000000025, 335, 1296, 456.0, 615.0, 772.8999999999999, 874.95, 13.280873881501403, 39.336807111907966, 4.007607450570247], "isController": false}, {"data": ["Get tournament result", 800, 0, 0.0, 2520.1125000000006, 310, 6472, 2592.5, 4049.7999999999997, 4311.4, 4561.93, 9.62521807134693, 51.1352634527462, 3.1770739337063105], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
