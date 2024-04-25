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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.491, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9541666666666667, 500, 1500, "Knock_out"], "isController": false}, {"data": [0.024166666666666666, 500, 1500, "Get_all_group"], "isController": false}, {"data": [0.023333333333333334, 500, 1500, "Tournamnent_list "], "isController": false}, {"data": [0.97, 500, 1500, "Break_tab_knock_out"], "isController": false}, {"data": [0.9716666666666667, 500, 1500, "Players_knock_out"], "isController": false}, {"data": [0.13583333333333333, 500, 1500, "Get_knock_out_player_details"], "isController": false}, {"data": [0.13916666666666666, 500, 1500, "Result_Round_robin"], "isController": false}, {"data": [0.07, 500, 1500, "Get_Knock_out"], "isController": false}, {"data": [0.615, 500, 1500, "Home_page "], "isController": false}, {"data": [0.87, 500, 1500, "Result"], "isController": false}, {"data": [0.014166666666666666, 500, 1500, "Get_position_after_group"], "isController": false}, {"data": [0.8541666666666666, 500, 1500, "Players_schedule"], "isController": false}, {"data": [0.085, 500, 1500, "Players_Round_robin"], "isController": false}, {"data": [0.8791666666666667, 500, 1500, "Currency_home_page"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "PlayerA_VS_playerB"], "isController": false}, {"data": [0.07666666666666666, 500, 1500, "Players_schedule_knock_out "], "isController": false}, {"data": [0.9733333333333334, 500, 1500, "Player_VS_player"], "isController": false}, {"data": [0.83, 500, 1500, "Country_home_page"], "isController": false}, {"data": [0.13, 500, 1500, "Break_tab_Round_robin"], "isController": false}, {"data": [0.975, 500, 1500, "Players"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12000, 0, 0.0, 3782.494166666659, 55, 23047, 773.5, 12423.699999999999, 13581.749999999995, 14986.96, 21.448986267286543, 181.34493166319461, 7.082983111604438], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Knock_out", 600, 0, 0.0, 252.49333333333317, 58, 8393, 151.5, 491.79999999999995, 615.5999999999995, 1259.91, 2.633288274845075, 11.821771403421957, 0.8743339975071538], "isController": false}, {"data": ["Get_all_group", 600, 0, 0.0, 9191.538333333336, 654, 19560, 9412.0, 14870.2, 15211.349999999999, 15764.87, 2.3745918670228554, 6.240260463045414, 0.7814818937370139], "isController": false}, {"data": ["Tournamnent_list ", 600, 0, 0.0, 2805.7683333333275, 913, 11975, 2641.5, 4095.6999999999994, 4731.899999999997, 5925.75, 2.621850502084371, 237.49780146911021, 0.9959959426863481], "isController": false}, {"data": ["Break_tab_knock_out", 600, 0, 0.0, 198.20166666666663, 78, 2055, 104.0, 450.79999999999995, 537.6999999999996, 847.6800000000003, 2.637223531066493, 6.320064985583178, 0.8704897983403074], "isController": false}, {"data": ["Players_knock_out", 600, 0, 0.0, 199.6083333333332, 79, 1284, 105.0, 451.9, 525.8499999999998, 1245.1000000000017, 2.637675680190616, 6.321148553894308, 0.8706390428754182], "isController": false}, {"data": ["Get_knock_out_player_details", 600, 0, 0.0, 7324.144999999999, 58, 15979, 7311.5, 13438.7, 13740.199999999999, 14389.230000000001, 2.301460660365779, 2.7734398973548546, 0.7326915774211366], "isController": false}, {"data": ["Result_Round_robin", 600, 0, 0.0, 7310.881666666669, 234, 15093, 7348.0, 13666.5, 14021.8, 14636.890000000001, 2.299749327323322, 13.049168460950256, 0.7590969459328932], "isController": false}, {"data": ["Get_Knock_out", 600, 0, 0.0, 7706.384999999997, 55, 15842, 7671.5, 13436.8, 13798.3, 14418.85, 2.3042094065508674, 3.742090081146575, 0.7650695295188428], "isController": false}, {"data": ["Home_page ", 600, 0, 0.0, 1174.761666666667, 219, 15261, 601.5, 2462.899999999999, 4744.299999999994, 9193.560000000001, 2.830909760033216, 8.556314167287894, 0.8542491365725232], "isController": false}, {"data": ["Result", 600, 0, 0.0, 480.0316666666668, 237, 6412, 382.0, 706.0, 906.8499999999998, 1884.880000000001, 2.5625803475713145, 14.541617439320232, 0.8458517162881878], "isController": false}, {"data": ["Get_position_after_group", 600, 0, 0.0, 9505.831666666672, 711, 17197, 9955.0, 14929.8, 15340.4, 15786.84, 2.2974157901387255, 5.848987270402009, 0.8009545283979737], "isController": false}, {"data": ["Players_schedule", 600, 0, 0.0, 469.48499999999984, 236, 2581, 382.5, 723.5999999999999, 882.4999999999993, 1365.2900000000006, 2.633970315154548, 14.946418253085037, 0.8694159829318724], "isController": false}, {"data": ["Players_Round_robin", 600, 0, 0.0, 6818.879999999996, 249, 23047, 6908.0, 12226.3, 12939.65, 14665.730000000005, 2.8180392083188517, 6.753386930873499, 0.930173098058371], "isController": false}, {"data": ["Currency_home_page", 600, 0, 0.0, 381.3850000000003, 104, 9202, 267.5, 670.9999999999998, 907.5999999999995, 1430.5200000000004, 2.6376408939844205, 23.592178062191177, 0.826838600555663], "isController": false}, {"data": ["PlayerA_VS_playerB", 600, 0, 0.0, 6654.418333333335, 147, 21879, 6469.5, 13316.7, 13676.449999999997, 14260.77, 2.3089355806972987, 2.895188755483722, 0.7688935869314246], "isController": false}, {"data": ["Players_schedule_knock_out ", 600, 0, 0.0, 7622.730000000004, 244, 21607, 7523.5, 13568.6, 14010.75, 14466.93, 2.513562765756897, 14.262087684066106, 0.8296720847908506], "isController": false}, {"data": ["Player_VS_player", 600, 0, 0.0, 245.75666666666652, 140, 2554, 167.0, 450.0, 528.2999999999977, 1183.760000000002, 2.56617524410742, 3.2177431771815694, 0.8545564045318654], "isController": false}, {"data": ["Country_home_page", 600, 0, 0.0, 453.37999999999994, 107, 12711, 305.0, 833.6999999999999, 1035.9499999999998, 2618.9200000000046, 2.6857173551055484, 45.29040053277918, 0.839286673470484], "isController": false}, {"data": ["Break_tab_Round_robin", 600, 0, 0.0, 6654.696666666673, 79, 17937, 6542.0, 12806.8, 13343.9, 13662.8, 2.6638725603367135, 6.3839289678381785, 0.8792860599548918], "isController": false}, {"data": ["Players", 600, 0, 0.0, 199.50499999999997, 79, 4684, 103.5, 444.9, 485.89999999999986, 1021.8200000000011, 2.6328722881415434, 6.309637299901706, 0.8690535482342203], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
