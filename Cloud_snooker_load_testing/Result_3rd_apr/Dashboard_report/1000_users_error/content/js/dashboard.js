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

    var data = {"OkPercent": 94.11818181818182, "KoPercent": 5.881818181818182};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.12481818181818181, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.109, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.073, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.072, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.1275, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.0895, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.128, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.1175, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.0915, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.103, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.3885, 500, 1500, "Home page "], "isController": false}, {"data": [0.0735, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11000, 647, 5.881818181818182, 2881.0576363636255, 1, 16409, 2851.5, 5018.9, 5837.899999999998, 9473.98, 110.9945108169196, 1045.8550211457157, 35.64262944419499], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 1000, 106, 10.6, 2599.414000000001, 98, 10065, 2655.0, 4507.4, 5235.899999999999, 6219.220000000001, 10.63524306848033, 12.465314982664554, 3.486303302508854], "isController": false}, {"data": ["Get tournamnent list ", 1000, 83, 8.3, 3453.3529999999982, 1, 16409, 3203.0, 5901.6, 7879.799999999992, 13172.880000000001, 12.010136555252632, 635.0417525829299, 4.183761563509602], "isController": false}, {"data": ["Get Players schedule", 1000, 92, 9.2, 3063.668000000003, 35, 10838, 3113.0, 4757.2, 5616.249999999996, 7576.040000000003, 10.850223514604401, 53.23556208226639, 3.543032410295777], "isController": false}, {"data": ["Get Home page country ", 1000, 8, 0.8, 3090.5119999999974, 218, 14273, 2916.5, 4840.8, 6803.499999999999, 11563.67, 12.634238787113077, 211.55740435486416, 3.9166140240050535], "isController": false}, {"data": ["Get Break list ", 1000, 89, 8.9, 2998.4650000000006, 101, 8599, 2974.0, 5045.0, 5619.0, 7141.97, 11.015156855833627, 32.43043971473497, 3.5971156467549346], "isController": false}, {"data": ["Get Home page currency", 1000, 57, 5.7, 2995.1150000000002, 1, 15275, 2901.0, 5549.7, 5954.0, 10253.52, 11.687158150624095, 99.92617231326844, 3.454822103191763], "isController": false}, {"data": ["Get single knockout Player details", 1000, 17, 1.7, 2810.521000000004, 49, 9271, 2817.0, 4525.4, 5312.65, 6068.97, 10.62541173470472, 12.547148189297022, 3.361718401353677], "isController": false}, {"data": ["Get knockout players list ", 1000, 11, 1.1, 2946.547999999999, 78, 12452, 2969.5, 4518.9, 5416.9, 7052.490000000002, 10.782252412528978, 48.111915989406434, 3.540664254137689], "isController": false}, {"data": ["Get Players list ", 1000, 87, 8.7, 2982.5050000000024, 1, 12107, 3109.5, 5052.599999999999, 5812.149999999999, 8153.490000000001, 11.355764753977358, 33.51884631107982, 3.697488016119508], "isController": false}, {"data": ["Home page ", 1000, 4, 0.4, 1837.5399999999997, 422, 13580, 772.5, 5692.799999999999, 7500.749999999993, 10346.190000000002, 13.339202582469621, 39.47351417957235, 4.009107757413262], "isController": false}, {"data": ["Get tournament result", 1000, 93, 9.3, 2913.9929999999963, 63, 11861, 2962.5, 4972.7, 5773.549999999998, 7894.92, 10.574513308024999, 51.83122481944019, 3.4530019886694094], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.1545595054095827, 0.00909090909090909], "isController": false}, {"data": ["400", 321, 49.61360123647604, 2.918181818181818], "isController": false}, {"data": ["401", 103, 15.919629057187016, 0.9363636363636364], "isController": false}, {"data": ["500/Internal Server Error", 1, 0.1545595054095827, 0.00909090909090909], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 219, 33.84853168469861, 1.990909090909091], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, 0.3091190108191654, 0.01818181818181818], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11000, 647, "400", 321, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 219, "401", 103, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get playerA_Vs_playerB", 1000, 106, "401", 92, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 13, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", ""], "isController": false}, {"data": ["Get tournamnent list ", 1000, 83, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 83, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players schedule", 1000, 92, "400", 83, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Home page country ", 1000, 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Break list ", 1000, 89, "400", 80, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["Get Home page currency", 1000, 57, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get single knockout Player details", 1000, 17, "401", 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["Get knockout players list ", 1000, 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players list ", 1000, 87, "400", 75, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["Home page ", 1000, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 3, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get tournament result", 1000, 93, "400", 83, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 9, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
