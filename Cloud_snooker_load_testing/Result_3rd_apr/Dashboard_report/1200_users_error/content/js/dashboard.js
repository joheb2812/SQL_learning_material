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

    var data = {"OkPercent": 98.97727272727273, "KoPercent": 1.0227272727272727};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.22428030303030302, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.18416666666666667, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.09875, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.12291666666666666, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.20583333333333334, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.15833333333333333, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.175, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.17833333333333334, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.16833333333333333, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.16916666666666666, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.8654166666666666, 500, 1500, "Home page "], "isController": false}, {"data": [0.14083333333333334, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13200, 135, 1.0227272727272727, 2391.4085606060567, 0, 9613, 2464.0, 4286.9, 4522.949999999999, 5956.819999999996, 105.09303121740722, 1043.0880261742354, 34.29567485201389], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 1200, 15, 1.25, 2406.84916666667, 53, 7344, 2587.0, 4190.700000000001, 4380.85, 5667.650000000001, 9.843407787776128, 11.876422359608396, 3.2691601035403455], "isController": false}, {"data": ["Get tournamnent list ", 1200, 11, 0.9166666666666666, 2849.0275000000006, 0, 7033, 2814.5, 4687.9, 4813.0, 5330.400000000001, 10.768126346015794, 613.706874915874, 4.053128715564429], "isController": false}, {"data": ["Get Players schedule", 1200, 14, 1.1666666666666667, 2800.589166666662, 1, 8322, 2958.5, 4486.9, 4656.0, 6315.43, 9.975062344139651, 52.49654184850374, 3.2836934356816294], "isController": false}, {"data": ["Get Home page country ", 1200, 4, 0.3333333333333333, 2346.5533333333337, 60, 7374, 2264.5, 4203.700000000001, 4420.9, 5255.810000000002, 11.157912354598453, 187.60846456956028, 3.4752247854426437], "isController": false}, {"data": ["Get Break list ", 1200, 15, 1.25, 2600.3883333333347, 1, 6636, 2777.0, 4313.8, 4481.8, 6152.730000000002, 10.093703211479905, 31.463834051107785, 3.3199724289445354], "isController": false}, {"data": ["Get Home page currency", 1200, 28, 2.3333333333333335, 2456.2991666666653, 0, 8994, 2459.5, 4308.8, 4509.0, 5873.380000000001, 10.539258738802038, 92.56641757146934, 3.226721686720534], "isController": false}, {"data": ["Get single knockout Player details", 1200, 4, 0.3333333333333333, 2486.0658333333326, 55, 6924, 2694.5, 4155.9, 4323.0, 5828.310000000001, 9.836146197919655, 11.627960961770178, 3.1261142509364834], "isController": false}, {"data": ["Get knockout players list ", 1200, 2, 0.16666666666666666, 2510.7775000000024, 1, 8366, 2663.0, 4200.5, 4353.9, 5318.860000000001, 9.884190237714776, 44.332362846564415, 3.2763902731331234], "isController": false}, {"data": ["Get Players list ", 1200, 24, 2.0, 2524.222500000001, 1, 9613, 2661.5, 4324.9, 4494.9, 4762.56, 10.298926336929375, 32.02848752757109, 3.359203351227718], "isController": false}, {"data": ["Home page ", 1200, 6, 0.5, 702.5425000000005, 224, 8032, 352.0, 1094.500000000004, 2857.0000000000064, 7760.860000000001, 11.483253588516746, 33.95897502990431, 3.4478356758373208], "isController": false}, {"data": ["Get tournament result", 1200, 12, 1.0, 2622.179166666666, 89, 8791, 2824.0, 4359.5, 4556.9, 5748.040000000002, 9.822700260301557, 51.74905136760637, 3.2389410847739963], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 43, 31.85185185185185, 0.32575757575757575], "isController": false}, {"data": ["401", 14, 10.37037037037037, 0.10606060606060606], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 78, 57.77777777777778, 0.5909090909090909], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13200, 135, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 78, "400", 43, "401", 14, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get playerA_Vs_playerB", 1200, 15, "401", 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["Get tournamnent list ", 1200, 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players schedule", 1200, 14, "400", 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Home page country ", 1200, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Break list ", 1200, 15, "400", 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Home page currency", 1200, 28, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get single knockout Player details", 1200, 4, "401", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Get knockout players list ", 1200, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players list ", 1200, 24, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 14, "400", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["Home page ", 1200, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get tournament result", 1200, 12, "400", 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
