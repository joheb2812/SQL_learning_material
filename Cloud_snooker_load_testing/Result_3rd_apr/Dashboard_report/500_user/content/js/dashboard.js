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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06318181818181819, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.079, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.026, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.037, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.141, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.037, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.089, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.019, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.029, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.047, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.166, 500, 1500, "Home page "], "isController": false}, {"data": [0.025, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5500, 0, 0.0, 3554.886545454546, 136, 16844, 3472.5, 5223.900000000001, 6440.549999999998, 8512.99, 108.40428886786503, 1084.540678401431, 35.589405205376856], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 500, 0, 0.0, 2872.4620000000004, 136, 5180, 2926.0, 4678.6, 4957.349999999999, 5135.79, 12.950683796104435, 15.66982150720058, 4.312678881319934], "isController": false}, {"data": ["Get tournamnent list ", 500, 0, 0.0, 5089.824000000007, 590, 14233, 4895.0, 7461.700000000001, 8638.349999999999, 11178.87, 16.37411579774692, 941.1436245333376, 6.220245161448782], "isController": false}, {"data": ["Get Players schedule", 500, 0, 0.0, 3860.8399999999992, 906, 7064, 4021.5, 5175.8, 5243.9, 6108.000000000004, 12.482524465747952, 66.39113444302976, 4.1202082709207115], "isController": false}, {"data": ["Get Home page country ", 500, 0, 0.0, 3349.1780000000017, 284, 10271, 3158.5, 5900.900000000001, 6518.149999999999, 9064.230000000001, 18.79840589518009, 316.99795919806, 5.874501842243778], "isController": false}, {"data": ["Get Break list ", 500, 0, 0.0, 3535.0519999999988, 786, 7681, 3626.0, 4984.1, 5128.8, 6604.740000000002, 12.91956280199478, 40.6007354461125, 4.264465065502184], "isController": false}, {"data": ["Get Home page currency", 500, 0, 0.0, 3400.3299999999986, 210, 8758, 3425.5, 5045.9, 5081.95, 7024.52, 14.44919662466767, 129.2395410393307, 4.529484488787424], "isController": false}, {"data": ["Get single knockout Player details", 500, 0, 0.0, 2925.170000000003, 797, 6142, 2637.0, 4583.8, 4863.7, 5064.87, 12.373481155188202, 14.621008005642308, 3.9392137271399936], "isController": false}, {"data": ["Get knockout players list ", 500, 0, 0.0, 3480.195999999999, 845, 6680, 3500.0, 4950.9, 5013.65, 5075.9, 12.368889768454382, 55.5304205113299, 4.10685793093212], "isController": false}, {"data": ["Get Players list ", 500, 0, 0.0, 3120.2939999999985, 854, 7605, 3020.0, 4509.200000000001, 5047.65, 6369.780000000004, 13.176619406525063, 41.408555908396146, 4.349313827544406], "isController": false}, {"data": ["Home page ", 500, 0, 0.0, 4147.370000000001, 636, 16844, 4550.0, 7196.200000000001, 8192.65, 13999.250000000002, 23.12138728323699, 68.48356213872832, 6.977059248554913], "isController": false}, {"data": ["Get tournament result", 500, 0, 0.0, 3323.0360000000014, 594, 8136, 3348.0, 4975.200000000002, 5171.75, 5304.79, 12.536041118214868, 66.67459963018679, 4.137872947223267], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5500, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
