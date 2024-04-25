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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Get_all_group"], "isController": false}, {"data": [0.035, 500, 1500, "Tournamnent_list "], "isController": false}, {"data": [0.0025, 500, 1500, "Get_group_match_list "], "isController": false}, {"data": [0.2525, 500, 1500, "Break_tab_knock_out"], "isController": false}, {"data": [0.0025, 500, 1500, "Result_Round_robin"], "isController": false}, {"data": [0.4925, 500, 1500, "Country_home_page_Round_robin"], "isController": false}, {"data": [0.0, 500, 1500, "Get_Knock_out"], "isController": false}, {"data": [0.03, 500, 1500, "Home_page "], "isController": false}, {"data": [0.01, 500, 1500, "Result"], "isController": false}, {"data": [0.0275, 500, 1500, "Players_schedule_knock_out "], "isController": false}, {"data": [0.1325, 500, 1500, "Currency_home_page_round_robin"], "isController": false}, {"data": [0.0775, 500, 1500, "Player_VS_player"], "isController": false}, {"data": [0.2125, 500, 1500, "Break_tab_Round_robin"], "isController": false}, {"data": [0.0, 500, 1500, "Players"], "isController": false}, {"data": [0.005, 500, 1500, "Tournamnent_list_round_robin"], "isController": false}, {"data": [0.0, 500, 1500, "Knock_out"], "isController": false}, {"data": [0.355, 500, 1500, "Players_knock_out"], "isController": false}, {"data": [0.0, 500, 1500, "Get_knock_out_player_details"], "isController": false}, {"data": [0.6275, 500, 1500, "Home_page_round_robin"], "isController": false}, {"data": [0.0, 500, 1500, "Get_position_after_group"], "isController": false}, {"data": [0.025, 500, 1500, "Players_schedule"], "isController": false}, {"data": [0.2675, 500, 1500, "Players_Round_robin"], "isController": false}, {"data": [0.2, 500, 1500, "Currency_home_page"], "isController": false}, {"data": [0.0725, 500, 1500, "PlayerA_VS_playerB"], "isController": false}, {"data": [0.6325, 500, 1500, "Country_home_page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5000, 0, 0.0, 4557.178399999997, 111, 26777, 3171.0, 12495.7, 13298.8, 14740.879999999997, 37.778331859978394, 474.30126761650837, 12.468325229881149], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get_all_group", 200, 0, 0.0, 12291.785000000003, 4119, 23908, 13473.5, 14694.1, 15477.199999999999, 15923.060000000001, 3.1514425728377167, 8.281769495611616, 1.046377416762523], "isController": false}, {"data": ["Tournamnent_list ", 200, 0, 0.0, 3497.205, 847, 7183, 3448.0, 5329.7, 5630.9, 7064.910000000004, 22.79202279202279, 2290.858262108262, 8.658297720797721], "isController": false}, {"data": ["Get_group_match_list ", 200, 0, 0.0, 11880.840000000004, 586, 25329, 12632.0, 13953.300000000003, 14451.5, 25246.95, 3.0557210737803855, 17.338829811614797, 1.0265312982230983], "isController": false}, {"data": ["Break_tab_knock_out", 200, 0, 0.0, 2035.3349999999996, 151, 4380, 1803.5, 3928.6000000000004, 4125.5, 4297.81, 12.897401173663507, 30.8958252724576, 4.25714999677565], "isController": false}, {"data": ["Result_Round_robin", 200, 0, 0.0, 4848.58, 506, 8172, 5597.5, 6836.9, 7310.799999999999, 8105.84, 7.496813854112002, 42.53790283660694, 2.474534260439313], "isController": false}, {"data": ["Country_home_page_Round_robin", 200, 0, 0.0, 1201.1699999999996, 134, 4632, 884.5, 2624.1, 2879.1499999999996, 4384.950000000008, 21.51694459386767, 362.85774021651423, 6.724045185583647], "isController": false}, {"data": ["Get_Knock_out", 200, 0, 0.0, 8852.210000000005, 2289, 18124, 9272.5, 13664.4, 13973.95, 18041.180000000033, 4.073900556087426, 6.6161099851302625, 1.352662294013403], "isController": false}, {"data": ["Home_page ", 200, 0, 0.0, 2107.92, 1097, 3933, 2067.0, 2815.6, 3053.85, 3402.86, 47.05882352941176, 142.23345588235293, 14.200367647058824], "isController": false}, {"data": ["Result", 200, 0, 0.0, 3987.2649999999976, 582, 7811, 4403.5, 5017.6, 5099.799999999999, 5190.93, 10.368066355624675, 58.829157756609646, 3.422271902540176], "isController": false}, {"data": ["Players_schedule_knock_out ", 200, 0, 0.0, 8194.654999999999, 821, 25601, 8520.0, 13487.8, 14408.15, 23630.66000000008, 3.5256579759197564, 20.004528266962822, 1.1637425740828884], "isController": false}, {"data": ["Currency_home_page_round_robin", 200, 0, 0.0, 2371.635000000003, 189, 11094, 2514.5, 3230.5, 4495.9, 10036.870000000035, 8.847208705653365, 79.13409154372732, 2.7733925727682913], "isController": false}, {"data": ["Player_VS_player", 200, 0, 0.0, 3698.7599999999966, 153, 9276, 4222.5, 4796.5, 4945.749999999999, 8682.68000000001, 12.416190712689348, 15.568739135833125, 4.134688508815495], "isController": false}, {"data": ["Break_tab_Round_robin", 200, 0, 0.0, 5219.394999999999, 158, 13900, 2209.5, 12732.0, 12855.3, 13242.310000000003, 4.398311048557353, 10.536188478624208, 1.4517862640745953], "isController": false}, {"data": ["Players", 200, 0, 0.0, 3441.235000000003, 1583, 7441, 3230.0, 4585.4, 4660.95, 7306.270000000002, 9.306221208878135, 22.293125610720768, 3.0717800474617283], "isController": false}, {"data": ["Tournamnent_list_round_robin", 200, 0, 0.0, 3866.875000000001, 1235, 6868, 3826.5, 5605.900000000001, 5836.7, 6691.650000000002, 15.592110392141578, 1567.3384267560614, 5.92317474857722], "isController": false}, {"data": ["Knock_out", 200, 0, 0.0, 3142.1699999999996, 1646, 4736, 3103.5, 4175.7, 4462.7, 4670.55, 9.151642719868217, 41.08895432472316, 3.0386313718312437], "isController": false}, {"data": ["Players_knock_out", 200, 0, 0.0, 1504.494999999999, 111, 6125, 1203.5, 3384.6000000000004, 3788.45, 5965.290000000005, 12.967645723918823, 31.064096641379756, 4.280336186215393], "isController": false}, {"data": ["Get_knock_out_player_details", 200, 0, 0.0, 6217.504999999999, 1915, 14237, 6050.0, 10605.300000000001, 11000.099999999999, 12111.220000000001, 5.382855604898398, 6.486761539496703, 1.713682546090701], "isController": false}, {"data": ["Home_page_round_robin", 200, 0, 0.0, 921.6049999999997, 268, 7894, 637.0, 1710.0, 3312.5999999999885, 4597.180000000006, 22.9147571035747, 69.25895823785518, 6.914706977543538], "isController": false}, {"data": ["Get_position_after_group", 200, 0, 0.0, 11342.660000000003, 5573, 26777, 12511.0, 14826.4, 14945.35, 23449.260000000035, 3.3032735440821854, 7.842048814124798, 1.151629546130215], "isController": false}, {"data": ["Players_schedule", 200, 0, 0.0, 3294.6150000000007, 546, 5855, 3484.0, 4326.3, 4535.95, 5736.000000000008, 10.764262648008613, 61.07657343245426, 3.553047631862218], "isController": false}, {"data": ["Players_Round_robin", 200, 0, 0.0, 3421.6400000000003, 145, 13150, 1483.0, 10973.2, 12461.149999999989, 13043.36, 6.020832078993316, 14.422950282979107, 1.9873449635739657], "isController": false}, {"data": ["Currency_home_page", 200, 0, 0.0, 2017.4350000000022, 161, 5965, 2131.0, 3298.1000000000004, 3464.25, 4416.010000000001, 18.733608092918697, 167.56261123079804, 5.872547068190333], "isController": false}, {"data": ["PlayerA_VS_playerB", 200, 0, 0.0, 3494.779999999999, 156, 6780, 2938.0, 6311.8, 6478.55, 6696.92, 9.602458229306704, 12.040582389091607, 3.1976936095640487], "isController": false}, {"data": ["Country_home_page", 200, 0, 0.0, 1077.6900000000003, 142, 4598, 432.5, 3169.3, 3506.95, 4229.0300000000025, 34.364261168384886, 579.5260819372852, 10.738831615120274], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
