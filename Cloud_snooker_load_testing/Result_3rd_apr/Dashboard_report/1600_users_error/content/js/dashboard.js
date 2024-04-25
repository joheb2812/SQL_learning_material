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

    var data = {"OkPercent": 95.28836031524739, "KoPercent": 4.71163968475261};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.18406976413349646, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11807077983088005, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.08270794246404002, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.08794992175273865, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.150093808630394, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.11502347417840375, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.13348982785602503, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.13419981208894458, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.12010648293141246, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.12050078247261346, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.8768365114098156, 500, 1500, "Home page "], "isController": false}, {"data": [0.0848731600375822, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 35147, 1656, 4.71163968475261, 2756.835234870676, 0, 64928, 2864.0, 4722.0, 5003.0, 6537.980000000003, 29.707999952666004, 284.98115614291737, 9.539800462636993], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 3193, 225, 7.046664578766051, 2855.905731287187, 1, 8624, 2812.0, 4618.6, 4822.299999999999, 6315.299999999999, 2.7073914414888027, 3.204732295065391, 0.8924251890213708], "isController": false}, {"data": ["Get tournamnent list ", 3198, 177, 5.534709193245779, 3198.1835522201377, 0, 9183, 3341.0, 5104.2, 5450.0, 6839.129999999997, 2.7658665430473657, 150.55202785753235, 0.9925516862120947], "isController": false}, {"data": ["Get Players schedule", 3195, 205, 6.416275430359938, 3194.6312989045414, 1, 8797, 3235.0, 4921.0, 5093.2, 6593.4, 2.707012305679727, 13.625857908966438, 0.8838481890341854], "isController": false}, {"data": ["Get Home page country ", 3198, 40, 1.2507817385866167, 2844.860537836149, 1, 12064, 2955.0, 4671.1, 4850.049999999999, 6416.119999999997, 2.775567025430547, 46.28905673655417, 0.8567870772098869], "isController": false}, {"data": ["Get Break list ", 3195, 209, 6.541471048513302, 2936.5179968701095, 1, 14104, 2943.0, 4664.0, 4861.799999999999, 6273.599999999999, 2.706434452614102, 8.122263189632536, 0.8828149155139261], "isController": false}, {"data": ["Get Home page currency", 3195, 207, 6.47887323943662, 2764.4419405320787, 0, 14452, 2876.0, 4672.0, 4968.2, 6299.2, 2.7572411019644156, 23.431257676532468, 0.8086021135504377], "isController": false}, {"data": ["Get single knockout Player details", 3193, 75, 2.348888192922017, 2845.0892577513278, 1, 12611, 2870.0, 4562.0, 4737.299999999999, 6320.0599999999995, 2.705900099490345, 3.210048646668599, 0.8507479837103629], "isController": false}, {"data": ["Get knockout players list ", 3193, 37, 1.1587848418415283, 3001.2881302849914, 1, 8211, 3056.0, 4631.6, 4815.0, 6373.139999999999, 2.705748762795743, 12.069474368263169, 0.8879827003254017], "isController": false}, {"data": ["Get Players list ", 3195, 219, 6.854460093896714, 2880.311111111114, 0, 64928, 2797.0, 4656.4, 4845.2, 6285.879999999997, 2.7119915864599045, 8.148145929073568, 0.8771672391098045], "isController": false}, {"data": ["Home page ", 3199, 66, 2.063144732728978, 742.6305095342299, 111, 11616, 325.0, 1294.0, 3443.0, 8893.0, 2.7861339539064227, 8.20205299653105, 0.8233920519519486], "isController": false}, {"data": ["Get tournament result", 3193, 196, 6.1384278108362045, 3063.814594425298, 1, 10362, 3005.0, 4839.0, 5015.599999999999, 6553.42, 2.7063037467855757, 13.644879271825879, 0.8866766163024077], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, 0.30193236714975846, 0.014225965231740974], "isController": false}, {"data": ["400", 682, 41.18357487922705, 1.9404216576094688], "isController": false}, {"data": ["401", 231, 13.94927536231884, 0.657239593706433], "isController": false}, {"data": ["500/Internal Server Error", 4, 0.24154589371980675, 0.011380772185392778], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 725, 43.78019323671498, 2.062764958602441], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 9, 0.5434782608695652, 0.025606737417133752], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 35147, 1656, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 725, "400", 682, "401", 231, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get playerA_Vs_playerB", 3193, 225, "401", 195, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 29, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get tournamnent list ", 3198, 177, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 174, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players schedule", 3195, 205, "400", 174, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 31, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Home page country ", 3198, 40, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 39, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Break list ", 3195, 209, "400", 175, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 34, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Home page currency", 3195, 207, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 200, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Get single knockout Player details", 3193, 75, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 38, "401", 36, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", ""], "isController": false}, {"data": ["Get knockout players list ", 3193, 37, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players list ", 3195, 219, "400", 157, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 60, "500/Internal Server Error", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", ""], "isController": false}, {"data": ["Home page ", 3199, 66, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 63, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["Get tournament result", 3193, 196, "400", 176, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 20, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
