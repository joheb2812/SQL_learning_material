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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1968181818181818, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.04, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.175, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.0, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.845, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.0, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.35, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.07, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.11, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.04, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.5, 500, 1500, "Home page "], "isController": false}, {"data": [0.035, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1100, 0, 0.0, 3807.5381818181795, 90, 17885, 3360.0, 8666.0, 9354.65, 10221.97, 23.409236007661207, 263.0565512609066, 7.6853120344754196], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 100, 0, 0.0, 4137.020000000001, 329, 8994, 4307.0, 6109.1, 6254.75, 8968.529999999988, 7.168972686214065, 9.10823580543408, 2.387323912108395], "isController": false}, {"data": ["Get tournamnent list ", 100, 0, 0.0, 1815.8000000000002, 850, 3302, 1753.5, 2604.1, 2701.5499999999997, 3297.0399999999972, 27.449903925336262, 1823.6225723991217, 10.42774670601153], "isController": false}, {"data": ["Get Players schedule", 100, 0, 0.0, 7519.239999999999, 3479, 10083, 8761.0, 9716.800000000001, 9845.0, 10082.43, 4.6223537025053165, 37.499747215031896, 1.5257378432097624], "isController": false}, {"data": ["Get Home page country ", 100, 0, 0.0, 500.75000000000017, 259, 1840, 424.5, 845.6, 881.5999999999999, 1839.7499999999998, 36.42987249544627, 614.3716558515482, 11.384335154826958], "isController": false}, {"data": ["Get Break list ", 100, 0, 0.0, 8278.359999999999, 6469, 17885, 7677.5, 10165.6, 10333.1, 17809.98999999996, 4.104416351994747, 10.75004360942374, 1.3547780536857659], "isController": false}, {"data": ["Get Home page currency", 100, 0, 0.0, 2321.48, 145, 5727, 1188.0, 5595.8, 5651.95, 5727.0, 12.393109431156276, 110.84414018930474, 3.8849493431651996], "isController": false}, {"data": ["Get single knockout Player details", 100, 0, 0.0, 2971.68, 90, 7408, 2574.5, 3924.2, 5539.599999999997, 7390.989999999992, 6.2000124000248, 7.326186527373054, 1.9738320726641452], "isController": false}, {"data": ["Get knockout players list ", 100, 0, 0.0, 4088.0099999999998, 394, 9235, 4029.5, 7180.1, 7605.099999999999, 9229.329999999996, 4.786979415988511, 21.492041646720917, 1.5894267592149354], "isController": false}, {"data": ["Get Players list ", 100, 0, 0.0, 5583.12, 1161, 10375, 5622.5, 9579.2, 9818.55, 10374.93, 5.936127270568681, 15.547552089516799, 1.9593857592306778], "isController": false}, {"data": ["Home page ", 100, 0, 0.0, 820.3399999999997, 541, 1352, 762.5, 1205.0000000000002, 1258.3999999999999, 1351.96, 49.95004995004995, 147.94775536963039, 15.07281780719281], "isController": false}, {"data": ["Get tournament result", 100, 0, 0.0, 3847.120000000001, 888, 6393, 4016.5, 5764.0, 6092.849999999999, 6391.839999999999, 5.904233335301411, 47.897862298518035, 1.9488582688787859], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1100, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
