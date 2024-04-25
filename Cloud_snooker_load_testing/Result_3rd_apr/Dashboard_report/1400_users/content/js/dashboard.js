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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.27194805194805194, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2382142857142857, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.135, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.16964285714285715, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.21071428571428572, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.2382142857142857, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.235, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.22964285714285715, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.22285714285714286, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.9082142857142858, 500, 1500, "Home page "], "isController": false}, {"data": [0.16285714285714287, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15400, 0, 0.0, 2082.5367532467617, 66, 65939, 1928.5, 3832.0, 4037.0, 5014.939999999999, 83.86657590197413, 839.1387423417291, 27.53361130020422], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 1400, 0, 0.0, 2092.0728571428563, 93, 6106, 1946.5, 3749.4000000000005, 3877.0, 4812.42, 7.7139236321560425, 9.333546269766929, 2.568796834536338], "isController": false}, {"data": ["Get tournamnent list ", 1400, 0, 0.0, 2574.891428571427, 350, 7005, 2497.0, 4294.5, 4478.8, 5662.82, 7.717197775242127, 443.7499504755723, 2.931630795477722], "isController": false}, {"data": ["Get Players schedule", 1400, 0, 0.0, 2408.0028571428625, 169, 5940, 2496.5, 3997.0, 4149.0, 4822.0, 7.722944869206413, 41.02802610148501, 2.549175161906023], "isController": false}, {"data": ["Get Home page country ", 1400, 0, 0.0, 2065.017142857142, 130, 6221, 1837.0, 3797.0, 3944.0, 4992.91, 7.739809711249814, 130.52046678654156, 2.4186905347655667], "isController": false}, {"data": ["Get Break list ", 1400, 0, 0.0, 2224.9992857142875, 104, 8001, 2238.5, 3845.8, 3957.75, 4577.88, 7.725715042519025, 24.278663092603733, 2.550089535518975], "isController": false}, {"data": ["Get Home page currency", 1400, 0, 0.0, 2151.1828571428587, 66, 6692, 2040.0, 3813.9, 4024.5000000000005, 5441.83, 7.728017929001595, 69.12093192306206, 2.4225524953217894], "isController": false}, {"data": ["Get single knockout Player details", 1400, 0, 0.0, 2095.707857142856, 66, 7164, 2014.0, 3751.7000000000003, 3862.7000000000003, 4869.98, 7.715581617075684, 9.117044684239822, 2.456327741373704], "isController": false}, {"data": ["Get knockout players list ", 1400, 0, 0.0, 2134.072142857143, 73, 6650, 2139.5, 3778.7000000000003, 3898.9, 4973.450000000001, 7.726311955363992, 34.68495359383881, 2.5653770164294505], "isController": false}, {"data": ["Get Players list ", 1400, 0, 0.0, 2192.5835714285713, 105, 6142, 2124.0, 3862.7000000000003, 3969.8, 5179.280000000002, 7.724691977907381, 24.27544803213472, 2.54975184427021], "isController": false}, {"data": ["Home page ", 1400, 0, 0.0, 615.8999999999999, 249, 65939, 347.5, 692.6000000000004, 1489.95, 7510.400000000001, 7.820835823897123, 23.16464360730466, 2.3599983101408313], "isController": false}, {"data": ["Get tournament result", 1400, 0, 0.0, 2353.4742857142874, 203, 6471, 2282.5, 3964.8, 4117.9, 5451.950000000001, 7.70967564293188, 40.95782394404978, 2.5447952805771243], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
