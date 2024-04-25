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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.30992424242424244, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.28805555555555556, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.16527777777777777, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.1852777777777778, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.3219444444444444, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.24194444444444443, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.2738888888888889, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.2847222222222222, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.27, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.27194444444444443, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "Home page "], "isController": false}, {"data": [0.21722222222222223, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19800, 0, 0.0, 1710.5484343434346, 58, 68016, 1633.0, 2901.0, 3375.9500000000007, 4756.990000000002, 82.77972649243904, 828.2578137085109, 27.176795860177517], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 1800, 0, 0.0, 1642.364444444444, 78, 7028, 1614.5, 2781.9, 3268.749999999999, 3911.600000000003, 7.596026434171991, 9.190895265565524, 2.52953614653579], "isController": false}, {"data": ["Get tournamnent list ", 1800, 0, 0.0, 2098.4772222222236, 316, 6349, 2038.0, 3244.9, 4007.0999999999967, 5023.7300000000005, 7.571869662883536, 435.3873037623779, 2.8764231434196246], "isController": false}, {"data": ["Get Players schedule", 1800, 0, 0.0, 2015.295555555552, 149, 6996, 1998.0, 3140.9, 3742.0, 4520.82, 7.583321747702885, 40.286026505289364, 2.5030886237534915], "isController": false}, {"data": ["Get Home page country ", 1800, 0, 0.0, 1575.0238888888873, 119, 7580, 1432.5, 2680.8, 2936.5499999999984, 4259.650000000001, 7.577703029818261, 127.78697655963863, 2.368032196818207], "isController": false}, {"data": ["Get Break list ", 1800, 0, 0.0, 1786.3599999999979, 100, 4959, 1817.0, 2845.8, 3290.549999999991, 4259.96, 7.5848236107131415, 23.835900761010635, 2.503584355879924], "isController": false}, {"data": ["Get Home page currency", 1800, 0, 0.0, 1720.9016666666678, 62, 5441, 1701.5, 2812.8, 3334.6499999999987, 4258.6900000000005, 7.580926389204761, 67.80572306638997, 2.3764427450534455], "isController": false}, {"data": ["Get single knockout Player details", 1800, 0, 0.0, 1633.0544444444417, 58, 6040, 1613.5, 2742.0, 2987.7999999999993, 3919.4500000000007, 7.5897807818317515, 8.96839330665666, 2.416277866090968], "isController": false}, {"data": ["Get knockout players list ", 1800, 0, 0.0, 1714.6961111111107, 64, 6242, 1675.5, 2816.9, 3377.6499999999987, 4425.090000000001, 7.589044792228818, 34.068548672918496, 2.519800028669725], "isController": false}, {"data": ["Get Players list ", 1800, 0, 0.0, 1701.978333333334, 96, 5335, 1708.5, 2765.8, 3105.749999999999, 4163.99, 7.579777154551657, 23.82004187826878, 2.501918631092246], "isController": false}, {"data": ["Home page ", 1800, 0, 0.0, 1026.0422222222223, 231, 68016, 287.0, 1263.8000000000002, 6839.499999999973, 14201.7, 7.808636351805096, 23.12850981936021, 2.3563170241286864], "isController": false}, {"data": ["Get tournament result", 1800, 0, 0.0, 1901.838888888888, 152, 7200, 1873.0, 3060.0, 3390.8999999999996, 4538.85, 7.5894287689946545, 40.31856857839458, 2.5051044178908133], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
