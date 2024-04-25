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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07454545454545454, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0225, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.0525, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.0, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.5125, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.0, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.0675, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.115, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.025, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.015, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.0, 500, 1500, "Home page "], "isController": false}, {"data": [0.01, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 0, 0.0, 7813.632727272723, 133, 20435, 5076.0, 18172.100000000002, 19042.499999999993, 19975.97, 23.271065603249486, 261.50801091558424, 7.639950337430451], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 200, 0, 0.0, 10589.615000000005, 405, 12784, 11817.0, 12526.5, 12595.3, 12738.64, 6.008532115604158, 7.633886994532236, 2.0008881361533377], "isController": false}, {"data": ["Get tournamnent list ", 200, 0, 0.0, 3362.0750000000016, 677, 6666, 3182.0, 5285.8, 5658.249999999999, 6494.510000000003, 22.269235051775972, 1479.4470618528003, 8.45969964369224], "isController": false}, {"data": ["Get Players schedule", 200, 0, 0.0, 16281.309999999992, 3191, 19820, 17287.0, 19302.1, 19662.449999999997, 19791.69, 3.3521613060020448, 27.195456145349716, 1.1064751185827062], "isController": false}, {"data": ["Get Home page country ", 200, 0, 0.0, 981.515, 194, 1920, 1083.0, 1256.9, 1291.2999999999997, 1898.9300000000019, 60.82725060827251, 1025.8391071700123, 19.008515815085158], "isController": false}, {"data": ["Get Break list ", 200, 0, 0.0, 18258.460000000003, 3105, 20435, 18599.0, 19980.8, 20114.9, 20321.52, 3.3678538351435545, 8.820882798686537, 1.1116548791782437], "isController": false}, {"data": ["Get Home page currency", 200, 0, 0.0, 3684.28, 133, 16312, 3164.5, 6951.000000000002, 11775.7, 15124.14000000003, 8.126777732629012, 72.69406649989841, 2.547554347826087], "isController": false}, {"data": ["Get single knockout Player details", 200, 0, 0.0, 3484.2299999999996, 364, 19086, 2278.5, 8825.900000000001, 11810.349999999995, 19052.21000000002, 3.1373533287318818, 3.7072241482085713, 0.9988058448892515], "isController": false}, {"data": ["Get knockout players list ", 200, 0, 0.0, 8118.830000000002, 857, 19208, 8111.5, 14219.800000000001, 14851.0, 18532.990000000005, 2.990520051436945, 13.426909353599092, 0.9929461108286731], "isController": false}, {"data": ["Get Players list ", 200, 0, 0.0, 10543.684999999998, 1138, 19952, 10476.5, 18325.2, 19291.199999999997, 19911.75, 4.511922755882419, 11.817360186793602, 1.4892870034065018], "isController": false}, {"data": ["Home page ", 200, 0, 0.0, 2876.5950000000003, 1558, 3519, 2918.5, 3264.1, 3310.8, 3390.82, 55.540127742293805, 164.5050853929464, 16.759667453485143], "isController": false}, {"data": ["Get tournament result", 200, 0, 0.0, 7769.365, 868, 16554, 7993.5, 12112.4, 12581.25, 16223.790000000023, 4.071992833292613, 33.035552951176804, 1.3440757594266635], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
