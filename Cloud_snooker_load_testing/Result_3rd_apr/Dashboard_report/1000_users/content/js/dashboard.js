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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.24822727272727274, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2105, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.127, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.156, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.2375, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.1795, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.204, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.187, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.1855, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.1895, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.9145, 500, 1500, "Home page "], "isController": false}, {"data": [0.1395, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11000, 0, 0.0, 2232.81245454545, 79, 15800, 2186.0, 4026.8999999999996, 4265.899999999998, 5413.819999999996, 104.08190299566641, 1041.4165029545068, 34.17035487197926], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 1000, 0, 0.0, 2227.541999999998, 104, 5847, 2154.0, 3927.0, 4089.7499999999995, 4950.610000000001, 9.681666795755557, 11.714438632755016, 3.2240706810084423], "isController": false}, {"data": ["Get tournamnent list ", 1000, 0, 0.0, 2702.085999999996, 420, 8262, 2659.0, 4465.7, 4694.65, 5594.91, 10.66029891478157, 612.9872173021981, 4.049664333837921], "isController": false}, {"data": ["Get Players schedule", 1000, 0, 0.0, 2576.368000000002, 192, 6376, 2796.0, 4184.2, 4376.9, 5958.72, 9.808344939874845, 52.10847998852424, 3.237520107107127], "isController": false}, {"data": ["Get Home page country ", 1000, 0, 0.0, 2157.5910000000013, 159, 6802, 2059.5, 3923.5, 4085.85, 5584.680000000001, 11.073216104885503, 186.73470451468862, 3.4603800327767194], "isController": false}, {"data": ["Get Break list ", 1000, 0, 0.0, 2430.9860000000012, 112, 6336, 2659.0, 4053.3999999999996, 4181.9, 5255.140000000001, 9.971083856815236, 31.33491001096819, 3.2912366636753414], "isController": false}, {"data": ["Get Home page currency", 1000, 0, 0.0, 2326.262000000001, 79, 8797, 2263.0, 4057.8, 4273.7, 5451.200000000001, 10.368818887840485, 92.74041726719409, 3.2503817021453085], "isController": false}, {"data": ["Get single knockout Player details", 1000, 0, 0.0, 2289.892000000002, 81, 6169, 2269.0, 3873.9, 4089.95, 5133.890000000001, 9.676701406024716, 11.434383497353423, 3.0806686116836492], "isController": false}, {"data": ["Get knockout players list ", 1000, 0, 0.0, 2364.648000000001, 90, 6068, 2538.0, 3963.6, 4146.0, 5114.260000000002, 9.709774830321686, 43.59086778988532, 3.2239486741302468], "isController": false}, {"data": ["Get Players list ", 1000, 0, 0.0, 2428.9690000000005, 124, 6594, 2613.5, 4061.9, 4191.9, 6007.330000000002, 10.121867282076197, 31.80875870480586, 3.3410069739665573], "isController": false}, {"data": ["Home page ", 1000, 0, 0.0, 604.8340000000002, 281, 15800, 365.0, 529.0, 1399.7999999999997, 7647.88, 11.425176518977217, 33.84039099810342, 3.4476362737929303], "isController": false}, {"data": ["Get tournament result", 1000, 0, 0.0, 2451.758999999998, 201, 6473, 2392.5, 4098.099999999999, 4286.9, 4828.72, 9.666599000473663, 51.356167199537936, 3.190732873203221], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
