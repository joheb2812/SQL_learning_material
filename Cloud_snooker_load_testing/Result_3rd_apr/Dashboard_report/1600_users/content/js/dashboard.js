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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.20673295454545454, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2146875, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.021875, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.12125, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.174375, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.1778125, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.1565625, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.2234375, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.1875, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.1909375, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.6725, 500, 1500, "Home page "], "isController": false}, {"data": [0.133125, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17600, 0, 0.0, 2192.8134090908998, 60, 25122, 2018.0, 3790.0, 4263.850000000002, 5681.0, 96.14911854202973, 962.035961426312, 31.566001453162812], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 1600, 0, 0.0, 2017.6750000000025, 93, 6196, 1854.0, 3502.9, 3766.399999999998, 4775.67, 9.09008271975275, 10.998645009544587, 3.027068561948914], "isController": false}, {"data": ["Get tournamnent list ", 1600, 0, 0.0, 3504.160000000005, 613, 25122, 3456.0, 5114.700000000001, 5808.849999999999, 7683.750000000001, 9.555604660746173, 549.4610205049838, 3.6300099736623648], "isController": false}, {"data": ["Get Players schedule", 1600, 0, 0.0, 2422.7806249999962, 230, 7051, 2370.0, 3816.3000000000006, 4130.849999999999, 5509.210000000001, 9.180628873077806, 48.77265122934359, 3.030324764746385], "isController": false}, {"data": ["Get Home page country ", 1600, 0, 0.0, 2206.022500000004, 127, 11296, 2040.0, 3724.7000000000003, 4072.5999999999985, 5148.730000000001, 9.862540837083154, 166.31600389878568, 3.0820440115884855], "isController": false}, {"data": ["Get Break list ", 1600, 0, 0.0, 2156.3587499999994, 102, 6229, 2049.0, 3552.4000000000005, 3930.649999999995, 5072.060000000001, 9.248554913294798, 29.064306358381504, 3.0527456647398843], "isController": false}, {"data": ["Get Home page currency", 1600, 0, 0.0, 2330.834374999998, 134, 11789, 2164.0, 3828.800000000001, 4197.799999999999, 5459.6100000000015, 9.467903806097329, 84.68348816068217, 2.967965939216058], "isController": false}, {"data": ["Get single knockout Player details", 1600, 0, 0.0, 1960.2425000000005, 60, 6129, 1814.5, 3387.6000000000004, 3620.95, 4522.170000000001, 9.098870602686441, 10.751595145752534, 2.8967107582771288], "isController": false}, {"data": ["Get knockout players list ", 1600, 0, 0.0, 2124.1850000000004, 79, 6528, 1968.0, 3547.6000000000004, 3886.8499999999995, 5451.98, 9.161494239710498, 41.129114799248754, 3.0419023842788757], "isController": false}, {"data": ["Get Players list ", 1600, 0, 0.0, 2145.223124999999, 101, 8329, 2004.5, 3614.9, 3931.8999999999996, 5313.410000000001, 9.366804046459348, 29.43591349756463, 3.0917771168977146], "isController": false}, {"data": ["Home page ", 1600, 0, 0.0, 885.9081249999997, 243, 16539, 548.5, 1726.6000000000004, 2342.2499999999936, 5280.18, 9.970835306727821, 29.532757309868636, 3.008777450955954], "isController": false}, {"data": ["Get tournament result", 1600, 0, 0.0, 2367.557500000001, 221, 8550, 2214.0, 3782.9, 4160.9, 5595.390000000001, 9.077241653192637, 48.22406515048365, 2.996198905057726], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
