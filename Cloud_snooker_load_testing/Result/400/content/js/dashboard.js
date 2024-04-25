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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07583333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03875, 500, 1500, "Knock_out"], "isController": false}, {"data": [0.0, 500, 1500, "Get_all_group"], "isController": false}, {"data": [0.04, 500, 1500, "Tournamnent_list "], "isController": false}, {"data": [0.0, 500, 1500, "Get_group_match_list "], "isController": false}, {"data": [0.1, 500, 1500, "Break_tab_knock_out"], "isController": false}, {"data": [0.11875, 500, 1500, "Players_knock_out"], "isController": false}, {"data": [0.005, 500, 1500, "Get_knock_out_player_details"], "isController": false}, {"data": [0.0, 500, 1500, "Result_Round_robin"], "isController": false}, {"data": [0.0, 500, 1500, "Get_Knock_out"], "isController": false}, {"data": [0.5925, 500, 1500, "Home_page "], "isController": false}, {"data": [0.00875, 500, 1500, "Result"], "isController": false}, {"data": [0.0, 500, 1500, "Get_position_after_group"], "isController": false}, {"data": [0.05375, 500, 1500, "Players_schedule"], "isController": false}, {"data": [0.08, 500, 1500, "Players_Round_robin"], "isController": false}, {"data": [0.15875, 500, 1500, "Currency_home_page"], "isController": false}, {"data": [0.00375, 500, 1500, "PlayerA_VS_playerB"], "isController": false}, {"data": [0.035, 500, 1500, "Players_schedule_knock_out "], "isController": false}, {"data": [0.0225, 500, 1500, "Player_VS_player"], "isController": false}, {"data": [0.2375, 500, 1500, "Country_home_page"], "isController": false}, {"data": [0.0625, 500, 1500, "Break_tab_Round_robin"], "isController": false}, {"data": [0.035, 500, 1500, "Players"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8400, 0, 0.0, 8293.017023809507, 107, 43617, 4906.5, 22336.30000000001, 27490.8, 30491.839999999997, 33.82813695562876, 292.4099541369496, 11.184805327126139], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Knock_out", 400, 0, 0.0, 3879.7199999999993, 468, 9587, 4231.0, 5269.200000000001, 5375.85, 5889.460000000001, 6.620872299925515, 29.724516107340893, 2.198336505834644], "isController": false}, {"data": ["Get_all_group", 400, 0, 0.0, 20249.372500000016, 1587, 43617, 22082.5, 30668.7, 31339.25, 31923.45, 3.2070298093420777, 8.427848844667512, 1.0648341163831119], "isController": false}, {"data": ["Tournamnent_list ", 400, 0, 0.0, 3773.3399999999997, 800, 9074, 4024.5, 5599.6, 5856.0, 7717.200000000001, 9.901725375646707, 965.5922778919227, 3.76149528430329], "isController": false}, {"data": ["Get_group_match_list ", 400, 0, 0.0, 20800.699999999993, 1595, 42662, 22782.5, 29606.5, 30293.8, 30927.49, 2.8937697138061753, 16.420009535875508, 0.9721257632317619], "isController": false}, {"data": ["Break_tab_knock_out", 400, 0, 0.0, 3465.0424999999987, 176, 7043, 3770.5, 5245.200000000001, 5415.75, 5804.330000000001, 7.586533902323376, 18.17360123281176, 2.504148885727833], "isController": false}, {"data": ["Players_knock_out", 400, 0, 0.0, 3216.8825000000015, 139, 7308, 3455.0, 4768.8, 5060.25, 5740.230000000004, 8.4530853761623, 20.24943205832629, 2.7901785714285716], "isController": false}, {"data": ["Get_knock_out_player_details", 400, 0, 0.0, 11785.462500000003, 1190, 42129, 9356.0, 25964.800000000003, 28603.349999999995, 29800.99, 2.5637245790684706, 3.0894884087602468, 0.8161857546643764], "isController": false}, {"data": ["Result_Round_robin", 400, 0, 0.0, 10479.425000000007, 1594, 30512, 6916.5, 22720.800000000003, 27795.65, 30307.110000000004, 2.5980099243979113, 14.741752739276714, 0.8575462445766543], "isController": false}, {"data": ["Get_Knock_out", 400, 0, 0.0, 15119.2025, 3323, 42077, 13795.5, 27420.800000000003, 29442.399999999998, 30223.11, 2.62415534999672, 4.261689792035688, 0.8713015810535983], "isController": false}, {"data": ["Home_page ", 400, 0, 0.0, 735.7875000000003, 370, 1720, 680.0, 1117.7, 1350.4499999999998, 1667.89, 12.969748062643882, 39.18789111896501, 3.913722804059531], "isController": false}, {"data": ["Result", 400, 0, 0.0, 4253.570000000003, 481, 8402, 4089.0, 5653.6, 5819.7, 7031.610000000001, 6.053726825576996, 34.35008158342792, 1.9982027998486567], "isController": false}, {"data": ["Get_position_after_group", 400, 0, 0.0, 19459.569999999992, 2620, 42998, 17545.0, 29878.2, 30609.7, 35277.77, 2.701844684458314, 6.4142426053888295, 0.9419517112808771], "isController": false}, {"data": ["Players_schedule", 400, 0, 0.0, 4227.682500000003, 298, 9259, 4663.0, 5712.9, 5880.45, 6203.83, 6.966213862765587, 39.52700496342737, 2.2993948101706723], "isController": false}, {"data": ["Players_Round_robin", 400, 0, 0.0, 6934.170000000001, 431, 17733, 7152.0, 12635.7, 13084.8, 13849.82, 9.074616030309217, 21.73831359604347, 2.9953322443794095], "isController": false}, {"data": ["Currency_home_page", 400, 0, 0.0, 2909.482499999999, 107, 8369, 3240.0, 4726.7, 4884.3, 5391.290000000003, 9.340992947550324, 83.55155589562608, 2.9281823595348184], "isController": false}, {"data": ["PlayerA_VS_playerB", 400, 0, 0.0, 8631.472500000007, 494, 34278, 6152.0, 18600.200000000037, 24483.149999999998, 29977.190000000002, 2.7340706210441414, 3.428268239668631, 0.9104668767344261], "isController": false}, {"data": ["Players_schedule_knock_out ", 400, 0, 0.0, 14387.862499999997, 289, 26899, 15158.5, 24482.9, 25898.1, 26497.8, 4.472271914132379, 25.37586300872093, 1.4761991279069768], "isController": false}, {"data": ["Player_VS_player", 400, 0, 0.0, 3860.4149999999986, 363, 7128, 3732.0, 5422.400000000001, 5558.9, 5961.9, 6.097003322866811, 7.645070572813463, 2.0303497393531083], "isController": false}, {"data": ["Country_home_page", 400, 0, 0.0, 2342.1675, 184, 6682, 2521.5, 4134.8, 4342.0, 4747.860000000001, 11.540347941490435, 194.60785131343584, 3.606358731715761], "isController": false}, {"data": ["Break_tab_Round_robin", 400, 0, 0.0, 9807.292499999996, 127, 19329, 9598.5, 17419.5, 18182.45, 19113.54, 6.381213706847042, 15.286247287984175, 2.1062990555803713], "isController": false}, {"data": ["Players", 400, 0, 0.0, 3834.7374999999997, 175, 9796, 3839.0, 5234.5, 5376.8, 5823.0, 6.312932041286575, 15.122678024683564, 2.0837607714402955], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
