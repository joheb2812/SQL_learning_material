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

    var data = {"OkPercent": 99.22372193859711, "KoPercent": 0.7762780614028953};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.14728302678508987, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13221709006928406, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.04980769230769231, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.08519230769230769, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.09788461538461539, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.039038461538461536, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.1025, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.11326923076923077, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.10096153846153846, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.04173076923076923, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.7525, 500, 1500, "Home page "], "isController": false}, {"data": [0.105, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28598, 222, 0.7762780614028953, 4328.551681935801, 0, 30075, 5602.0, 7956.9000000000015, 8721.900000000001, 12990.790000000034, 58.18917280137385, 564.6047301752562, 19.01937861355109], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 2598, 31, 1.193225558121632, 4189.435719784455, 1, 15090, 4125.5, 7531.299999999999, 8020.299999999998, 9767.579999999987, 5.322047369908923, 6.388122464319953, 1.7665499054609368], "isController": false}, {"data": ["Get tournamnent list ", 2600, 16, 0.6153846153846154, 5347.403076923081, 1, 30075, 5168.0, 8192.8, 10913.149999999998, 18350.199999999983, 5.588393336915637, 319.10720882590005, 2.109870365394949], "isController": false}, {"data": ["Get Players schedule", 2600, 29, 1.1153846153846154, 4550.193846153838, 45, 16177, 4592.5, 7505.5, 8001.9, 10392.259999999984, 5.338962516376241, 26.261469063664048, 1.7532387673875636], "isController": false}, {"data": ["Get Home page country ", 2600, 14, 0.5384615384615384, 4570.93884615385, 47, 22274, 4471.0, 7462.8, 8504.649999999976, 14873.919999999998, 5.684315007247502, 95.40879132264719, 1.7667834866276488], "isController": false}, {"data": ["Get Break list ", 2600, 23, 0.8846153846153846, 5121.179230769236, 86, 19458, 5223.5, 8099.8, 8497.0, 10267.039999999979, 5.359531824281564, 11.567958815218802, 1.7647562984805727], "isController": false}, {"data": ["Get Home page currency", 2600, 26, 1.0, 4442.720384615372, 0, 20194, 4483.0, 7343.0, 7898.749999999999, 12505.909999999998, 5.506153126118438, 48.87249436942899, 1.7087894550284943], "isController": false}, {"data": ["Get single knockout Player details", 2600, 15, 0.5769230769230769, 4255.55038461538, 59, 13654, 4316.5, 7305.9, 7834.9, 9351.51999999999, 5.32916838327379, 6.294920021480649, 1.6932079428692655], "isController": false}, {"data": ["Get knockout players list ", 2600, 10, 0.38461538461538464, 4401.69269230769, 1, 20386, 4405.0, 7399.6, 7844.95, 10164.229999999961, 5.33434001903949, 23.898059672286873, 1.764355401429603], "isController": false}, {"data": ["Get Players list ", 2600, 25, 0.9615384615384616, 5014.511923076921, 1, 13932, 5076.5, 8047.200000000001, 8449.95, 9838.729999999994, 5.410275778403427, 11.6860514019117, 1.7794044261778275], "isController": false}, {"data": ["Home page ", 2600, 9, 0.34615384615384615, 1270.9815384615367, 208, 24461, 468.0, 3407.0, 6300.049999999989, 12488.369999999986, 5.76297333959872, 16.93686650584831, 1.7330025361238683], "isController": false}, {"data": ["Get tournament result", 2600, 24, 0.9230769230769231, 4449.353846153849, 79, 16879, 4369.0, 7549.700000000001, 8276.449999999997, 11127.829999999996, 5.325424395359507, 26.230581483217744, 1.7521734388313561], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 64, 28.82882882882883, 0.22379187355759145], "isController": false}, {"data": ["401", 33, 14.864864864864865, 0.11539268480313308], "isController": false}, {"data": ["500/Internal Server Error", 1, 0.45045045045045046, 0.0034967480243373664], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 114, 51.351351351351354, 0.39862927477445975], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 10, 4.504504504504505, 0.034967480243373664], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28598, 222, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 114, "400", 64, "401", 33, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 10, "500/Internal Server Error", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get playerA_Vs_playerB", 2598, 31, "401", 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 7, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", ""], "isController": false}, {"data": ["Get tournamnent list ", 2600, 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 15, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players schedule", 2600, 29, "400", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 13, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Home page country ", 2600, 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 12, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Break list ", 2600, 23, "400", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 6, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get Home page currency", 2600, 26, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 25, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get single knockout Player details", 2600, 15, "401", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["Get knockout players list ", 2600, 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players list ", 2600, 25, "400", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 7, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "", "", "", ""], "isController": false}, {"data": ["Home page ", 2600, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 8, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get tournament result", 2600, 24, "400", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 6, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
