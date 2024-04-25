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

    var data = {"OkPercent": 85.58441558441558, "KoPercent": 14.415584415584416};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10551948051948051, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03571428571428571, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.060714285714285714, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.019285714285714285, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.16142857142857142, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.032857142857142856, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.07571428571428572, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.01, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.011428571428571429, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.05285714285714286, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.6964285714285714, 500, 1500, "Home page "], "isController": false}, {"data": [0.004285714285714286, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7700, 1110, 14.415584415584416, 3460.6962337662276, 0, 11849, 4185.5, 5558.500000000003, 6121.95, 6719.949999999999, 130.1555104800541, 1109.2584100585277, 40.58054626753719], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 700, 160, 22.857142857142858, 3139.615714285715, 109, 8293, 2590.0, 4914.099999999999, 5321.349999999999, 6319.330000000001, 13.378949179105904, 14.64349132040672, 4.406112776179737], "isController": false}, {"data": ["Get tournamnent list ", 700, 150, 21.428571428571427, 3193.4971428571457, 0, 8948, 3021.0, 6534.799999999999, 6691.95, 7258.960000000002, 21.13718030014796, 963.8364902278287, 6.309011893438416], "isController": false}, {"data": ["Get Players schedule", 700, 168, 24.0, 4346.770000000005, 18, 8492, 4668.0, 5859.8, 6393.799999999999, 7017.540000000003, 14.092730164482294, 59.99820616531779, 4.511443108151638], "isController": false}, {"data": ["Get Home page country ", 700, 31, 4.428571428571429, 3051.952857142857, 68, 7566, 3175.5, 5191.9, 5410.95, 6432.280000000001, 26.226068712300027, 425.04850798255967, 7.832696414521749], "isController": false}, {"data": ["Get Break list ", 700, 171, 24.428571428571427, 4119.300000000002, 26, 11849, 4392.5, 5952.9, 6245.349999999999, 6633.97, 15.333727629186656, 39.911438310497026, 4.88717645150161], "isController": false}, {"data": ["Get Home page currency", 700, 46, 6.571428571428571, 3885.455714285717, 0, 8954, 4612.5, 5881.0, 6270.7, 7695.920000000003, 18.83391180348158, 159.899044136936, 5.516013449430947], "isController": false}, {"data": ["Get single knockout Player details", 700, 14, 2.0, 3921.8828571428576, 48, 8332, 4350.0, 5284.7, 6054.9, 6497.85, 13.444474321054047, 15.955522497887296, 4.230582938001767], "isController": false}, {"data": ["Get knockout players list ", 700, 6, 0.8571428571428571, 4357.324285714286, 55, 8126, 4507.5, 5574.6, 6073.299999999997, 6472.9400000000005, 13.75921375921376, 61.448710073710075, 4.53585687960688], "isController": false}, {"data": ["Get Players list ", 700, 171, 24.428571428571427, 3902.3728571428533, 60, 8259, 4343.0, 5581.8, 6168.349999999998, 6623.8, 17.006802721088437, 44.48977693756074, 5.365280877976191], "isController": false}, {"data": ["Home page ", 700, 38, 5.428571428571429, 520.0714285714289, 390, 2314, 502.0, 595.9, 650.0, 878.8200000000002, 33.26996197718631, 96.86191109196768, 9.494471096720533], "isController": false}, {"data": ["Get tournament result", 700, 155, 22.142857142857142, 3629.415714285715, 94, 8213, 2930.5, 5308.7, 5635.749999999998, 6556.99, 13.048503150281475, 56.33168785300861, 4.257146968087089], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.09009009009009009, 0.012987012987012988], "isController": false}, {"data": ["400", 592, 53.333333333333336, 7.688311688311688], "isController": false}, {"data": ["401", 161, 14.504504504504505, 2.090909090909091], "isController": false}, {"data": ["500/Internal Server Error", 2, 0.18018018018018017, 0.025974025974025976], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 349, 31.44144144144144, 4.532467532467533], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 5, 0.45045045045045046, 0.06493506493506493], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7700, 1110, "400", 592, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 349, "401", 161, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 5, "500/Internal Server Error", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get playerA_Vs_playerB", 700, 160, "401", 155, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["Get tournamnent list ", 700, 150, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 148, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players schedule", 700, 168, "400", 150, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["Get Home page country ", 700, 31, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 30, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Break list ", 700, 171, "400", 149, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 20, "500/Internal Server Error", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", ""], "isController": false}, {"data": ["Get Home page currency", 700, 46, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 46, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get single knockout Player details", 700, 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 8, "401", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["Get knockout players list ", 700, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 5, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players list ", 700, 171, "400", 143, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 27, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", ""], "isController": false}, {"data": ["Home page ", 700, 38, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 38, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get tournament result", 700, 155, "400", 150, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 5, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
