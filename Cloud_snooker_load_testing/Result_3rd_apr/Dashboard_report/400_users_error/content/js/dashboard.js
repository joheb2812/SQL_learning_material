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

    var data = {"OkPercent": 96.75, "KoPercent": 3.25};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05011363636363636, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.00375, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.02, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.0, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.1575, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.0, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.03375, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.0, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.0, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.00125, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.335, 500, 1500, "Home page "], "isController": false}, {"data": [0.0, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4400, 143, 3.25, 14035.01272727274, 3, 45856, 12848.5, 29548.7, 32891.0, 34013.93, 24.499841307846072, 273.1433181119949, 7.90872995641534], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 400, 14, 3.5, 13033.662500000006, 91, 27158, 12663.0, 16963.4, 17426.85, 23329.750000000004, 4.673443159247576, 5.9434079806344196, 1.5362232920025702], "isController": false}, {"data": ["Get tournamnent list ", 400, 0, 0.0, 6837.090000000001, 948, 23968, 5727.5, 13302.900000000003, 15808.749999999996, 20636.38000000001, 9.631591620515291, 639.8706507344089, 3.658876113652781], "isController": false}, {"data": ["Get Players schedule", 400, 32, 8.0, 23628.069999999996, 3, 44678, 24587.5, 33697.6, 33916.35, 34314.38, 3.224974200206398, 24.485569374234068, 1.0112687653186274], "isController": false}, {"data": ["Get Home page country ", 400, 0, 0.0, 3324.3200000000015, 339, 16258, 2517.5, 5982.8, 6317.349999999999, 9520.640000000001, 18.755568059267596, 316.256974726872, 5.861115018521123], "isController": false}, {"data": ["Get Break list ", 400, 1, 0.25, 25729.104999999985, 1925, 45856, 27793.0, 33797.9, 33993.5, 37219.840000000026, 3.4329165200525233, 8.986245671306825, 1.1302978215999107], "isController": false}, {"data": ["Get Home page currency", 400, 0, 0.0, 12310.890000000003, 233, 27525, 12504.5, 20357.0, 20567.85, 20865.96, 5.87311142760656, 52.52798445827889, 1.8410827815055721], "isController": false}, {"data": ["Get single knockout Player details", 400, 48, 12.0, 14635.240000000007, 65, 33629, 12297.0, 26047.5, 32699.25, 33317.520000000004, 3.3362525543183623, 3.945224532403353, 1.0183226729638435], "isController": false}, {"data": ["Get knockout players list ", 400, 35, 8.75, 18296.53499999999, 25, 36809, 17347.5, 29678.100000000006, 31582.399999999998, 33249.53, 3.2220646990591573, 13.66529871560446, 1.0083111648569403], "isController": false}, {"data": ["Get Players list ", 400, 0, 0.0, 20348.215000000007, 1317, 34692, 21103.5, 32568.1, 33859.15, 34254.8, 4.06227467070186, 10.639668619943738, 1.3408680065402623], "isController": false}, {"data": ["Home page ", 400, 0, 0.0, 1299.1074999999992, 483, 4374, 1092.0, 1924.9, 2294.1999999999994, 3549.350000000004, 47.84116732448272, 141.70142626480086, 14.436445999282382], "isController": false}, {"data": ["Get tournament result", 400, 13, 3.25, 14942.904999999999, 103, 33164, 14040.5, 21917.90000000002, 27223.899999999998, 29733.68, 3.756185968767314, 29.70960610814529, 1.215038125287583], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 1, 0.6993006993006993, 0.022727272727272728], "isController": false}, {"data": ["401", 24, 16.783216783216783, 0.5454545454545454], "isController": false}, {"data": ["500/Internal Server Error", 45, 31.46853146853147, 1.0227272727272727], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 45, 31.46853146853147, 1.0227272727272727], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 28, 19.58041958041958, 0.6363636363636364], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4400, 143, "500/Internal Server Error", 45, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 45, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 28, "401", 24, "400", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get playerA_Vs_playerB", 400, 14, "401", 6, "500/Internal Server Error", 3, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 2, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Players schedule", 400, 32, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 14, "500/Internal Server Error", 11, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6, "400", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Break list ", 400, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get single knockout Player details", 400, 48, "401", 18, "500/Internal Server Error", 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 9, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 7, "", ""], "isController": false}, {"data": ["Get knockout players list ", 400, 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 17, "500/Internal Server Error", 12, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get tournament result", 400, 13, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6, "500/Internal Server Error", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 2, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
