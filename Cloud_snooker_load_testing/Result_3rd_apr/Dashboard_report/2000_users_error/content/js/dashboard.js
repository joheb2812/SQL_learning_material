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

    var data = {"OkPercent": 96.54545454545455, "KoPercent": 3.4545454545454546};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15197727272727274, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09625, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.0545, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.05825, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.1015, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.073, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.0855, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.08725, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.076, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.0765, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.90375, 500, 1500, "Home page "], "isController": false}, {"data": [0.05925, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22000, 760, 3.4545454545454546, 3415.1075454545253, 0, 13281, 3948.0, 5744.0, 5915.0, 6663.970000000005, 87.32723101228139, 847.8406419444599, 28.19212428079079], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 2000, 99, 4.95, 3539.4310000000037, 1, 9770, 3660.5, 5576.0, 5750.95, 6014.99, 8.140935881988995, 9.7062534090169, 2.6900148495758573], "isController": false}, {"data": ["Get tournamnent list ", 2000, 77, 3.85, 3859.7814999999996, 0, 13281, 4031.5, 6005.700000000001, 6177.799999999999, 7834.500000000002, 8.674230595746158, 480.2513393893016, 3.168326257058655], "isController": false}, {"data": ["Get Players schedule", 2000, 96, 4.8, 3899.954500000001, 0, 8513, 4127.5, 5844.9, 5988.799999999999, 6882.650000000001, 8.212945244294056, 41.89530843202556, 2.6829983756334235], "isController": false}, {"data": ["Get Home page country ", 2000, 19, 0.95, 3595.308999999995, 1, 8936, 3787.5, 5641.0, 5789.95, 6524.67, 8.863048179529903, 148.2124486843359, 2.7433903818201153], "isController": false}, {"data": ["Get Break list ", 2000, 96, 4.8, 3793.938499999997, 1, 8432, 4047.0, 5766.9, 5912.0, 6753.8200000000015, 8.288265887569674, 25.22776947871988, 2.704953274901059], "isController": false}, {"data": ["Get Home page currency", 2000, 94, 4.7, 3520.284999999996, 0, 8428, 3818.0, 5634.0, 5837.95, 6706.090000000002, 8.544708048687747, 73.6418612123125, 2.554012401308622], "isController": false}, {"data": ["Get single knockout Player details", 2000, 38, 1.9, 3624.9654999999975, 1, 8362, 3913.5, 5538.0, 5677.549999999998, 5939.0, 8.146871804898714, 9.628540356802434, 2.5736318092572903], "isController": false}, {"data": ["Get knockout players list ", 2000, 23, 1.15, 3695.4474999999984, 12, 9088, 3977.0, 5590.9, 5728.95, 5948.93, 8.170301770095879, 36.451845230739536, 2.6815983612417225], "isController": false}, {"data": ["Get Players list ", 2000, 107, 5.35, 3724.841000000006, 0, 8705, 3954.5, 5767.9, 5948.499999999998, 6670.510000000001, 8.412197686645635, 25.585177609095688, 2.721970294426919], "isController": false}, {"data": ["Home page ", 2000, 25, 1.25, 494.76599999999917, 120, 7586, 292.0, 595.9000000000001, 1456.7999999999993, 3454.98, 9.073339805649061, 26.773525149880232, 2.703726782174063], "isController": false}, {"data": ["Get tournament result", 2000, 86, 4.3, 3817.463500000006, 0, 9985, 4063.5, 5826.9, 6005.799999999999, 6727.79, 8.1190578645254, 41.549429268290204, 2.6657269385772975], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 296, 38.94736842105263, 1.3454545454545455], "isController": false}, {"data": ["401", 107, 14.078947368421053, 0.4863636363636364], "isController": false}, {"data": ["500/Internal Server Error", 4, 0.5263157894736842, 0.01818181818181818], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 351, 46.18421052631579, 1.5954545454545455], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, 0.2631578947368421, 0.00909090909090909], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22000, 760, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 351, "400", 296, "401", 107, "500/Internal Server Error", 4, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get playerA_Vs_playerB", 2000, 99, "401", 84, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 14, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get tournamnent list ", 2000, 77, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 77, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players schedule", 2000, 96, "400", 77, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 19, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Home page country ", 2000, 19, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Break list ", 2000, 96, "400", 74, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 21, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get Home page currency", 2000, 94, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 93, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get single knockout Player details", 2000, 38, "401", 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 15, "", "", "", "", "", ""], "isController": false}, {"data": ["Get knockout players list ", 2000, 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 22, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players list ", 2000, 107, "400", 68, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 38, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Home page ", 2000, 25, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 24, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get tournament result", 2000, 86, "400", 77, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 9, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
