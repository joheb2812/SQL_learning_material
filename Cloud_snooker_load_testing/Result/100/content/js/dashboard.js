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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3236, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Get_all_group"], "isController": false}, {"data": [0.15, 500, 1500, "Tournamnent_list "], "isController": false}, {"data": [0.0, 500, 1500, "Get_group_match_list "], "isController": false}, {"data": [0.665, 500, 1500, "Break_tab_knock_out"], "isController": false}, {"data": [0.08, 500, 1500, "Result_Round_robin"], "isController": false}, {"data": [0.77, 500, 1500, "Country_home_page_Round_robin"], "isController": false}, {"data": [0.015, 500, 1500, "Get_Knock_out"], "isController": false}, {"data": [0.0, 500, 1500, "Home_page "], "isController": false}, {"data": [0.07, 500, 1500, "Result"], "isController": false}, {"data": [0.155, 500, 1500, "Players_schedule_knock_out "], "isController": false}, {"data": [0.58, 500, 1500, "Currency_home_page_round_robin"], "isController": false}, {"data": [0.29, 500, 1500, "Player_VS_player"], "isController": false}, {"data": [0.49, 500, 1500, "Break_tab_Round_robin"], "isController": false}, {"data": [0.29, 500, 1500, "Players"], "isController": false}, {"data": [0.13, 500, 1500, "Tournamnent_list_round_robin"], "isController": false}, {"data": [0.265, 500, 1500, "Knock_out"], "isController": false}, {"data": [0.64, 500, 1500, "Players_knock_out"], "isController": false}, {"data": [0.065, 500, 1500, "Get_knock_out_player_details"], "isController": false}, {"data": [0.925, 500, 1500, "Home_page_round_robin"], "isController": false}, {"data": [0.0, 500, 1500, "Get_position_after_group"], "isController": false}, {"data": [0.25, 500, 1500, "Players_schedule"], "isController": false}, {"data": [0.605, 500, 1500, "Players_Round_robin"], "isController": false}, {"data": [0.57, 500, 1500, "Currency_home_page"], "isController": false}, {"data": [0.295, 500, 1500, "PlayerA_VS_playerB"], "isController": false}, {"data": [0.79, 500, 1500, "Country_home_page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2500, 0, 0.0, 2231.0980000000013, 66, 12519, 1640.0, 6293.400000000001, 7299.799999999999, 8276.96, 35.880360525862564, 450.48923712522964, 11.841920550117687], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get_all_group", 100, 0, 0.0, 6814.910000000003, 2632, 8989, 7509.0, 8468.5, 8818.65, 8988.019999999999, 3.153479865031062, 8.287123356248621, 1.0470538614360947], "isController": false}, {"data": ["Tournamnent_list ", 100, 0, 0.0, 2029.8199999999995, 645, 3856, 1872.5, 3419.5, 3616.2499999999995, 3854.7499999999995, 17.041581458759374, 1713.0290878493524, 6.473803894001363], "isController": false}, {"data": ["Get_group_match_list ", 100, 0, 0.0, 6382.349999999998, 2221, 8301, 6766.5, 7773.0, 7966.749999999999, 8298.99, 3.1948881789137378, 18.127932807507985, 1.0732827476038338], "isController": false}, {"data": ["Break_tab_knock_out", 100, 0, 0.0, 744.2600000000001, 153, 2082, 651.5, 1635.2000000000003, 1685.0, 2080.9999999999995, 13.989927252378287, 33.51298002937885, 4.617768956351427], "isController": false}, {"data": ["Result_Round_robin", 100, 0, 0.0, 2290.97, 563, 3714, 2455.5, 3185.5000000000005, 3263.5, 3711.469999999999, 8.593280054996994, 48.75763324954885, 2.836453768153304], "isController": false}, {"data": ["Country_home_page_Round_robin", 100, 0, 0.0, 559.4100000000001, 131, 2031, 213.0, 1268.9, 1341.0999999999995, 2024.4899999999966, 33.42245989304813, 563.6531401445521, 10.44451871657754], "isController": false}, {"data": ["Get_Knock_out", 100, 0, 0.0, 3799.1000000000017, 1146, 7537, 3085.5, 6574.5, 7099.549999999999, 7536.92, 4.399472063352397, 7.144845743510778, 1.4607622085349758], "isController": false}, {"data": ["Home_page ", 100, 0, 0.0, 2499.1699999999996, 1765, 3748, 2478.0, 3184.5, 3545.3499999999976, 3747.3799999999997, 26.12330198537095, 78.9566598092999, 7.882910462382445], "isController": false}, {"data": ["Result", 100, 0, 0.0, 1928.58, 916, 2678, 1953.5, 2502.7000000000003, 2549.9, 2677.7799999999997, 10.454783063251437, 59.322113499738634, 3.450895190799791], "isController": false}, {"data": ["Players_schedule_knock_out ", 100, 0, 0.0, 4072.290000000001, 477, 10288, 4000.0, 7361.900000000001, 7469.2, 10262.939999999988, 3.8482259678288306, 21.83567594089125, 1.2702152120372507], "isController": false}, {"data": ["Currency_home_page_round_robin", 100, 0, 0.0, 851.9000000000002, 77, 2943, 878.5, 1376.7, 1547.9999999999998, 2931.4099999999944, 12.88161793121216, 115.22305326549015, 4.0380853085147494], "isController": false}, {"data": ["Player_VS_player", 100, 0, 0.0, 1434.4399999999998, 153, 2311, 1476.5, 2081.2, 2222.2999999999993, 2310.93, 11.936022917164001, 14.966653735975173, 3.9747888815946526], "isController": false}, {"data": ["Break_tab_Round_robin", 100, 0, 0.0, 2187.59, 114, 12519, 898.0, 6090.3, 6365.299999999999, 12464.129999999972, 5.264820469621986, 12.611918566389386, 1.7378020690744447], "isController": false}, {"data": ["Players", 100, 0, 0.0, 1339.6899999999998, 679, 2213, 1364.0, 2077.6000000000004, 2166.8, 2212.99, 10.626992561105208, 25.45704370350691, 3.5077377789585547], "isController": false}, {"data": ["Tournamnent_list_round_robin", 100, 0, 0.0, 1888.4799999999996, 645, 3856, 1882.0, 2520.3, 3030.599999999998, 3852.069999999998, 18.13236627379873, 1822.6980394378968, 6.888174297370807], "isController": false}, {"data": ["Knock_out", 100, 0, 0.0, 1414.4599999999996, 69, 2267, 1464.5, 2079.1, 2167.25, 2266.56, 10.297600659046443, 46.23300895891257, 3.4191252188240138], "isController": false}, {"data": ["Players_knock_out", 100, 0, 0.0, 734.0, 177, 1928, 531.0, 1669.0, 1711.95, 1927.6699999999998, 17.537706068046298, 42.01171189933357, 5.788813135741845], "isController": false}, {"data": ["Get_knock_out_player_details", 100, 0, 0.0, 2586.9500000000003, 672, 5175, 2332.5, 4319.500000000002, 5048.8, 5174.599999999999, 6.154224875376946, 7.41632177364761, 1.9592551849344577], "isController": false}, {"data": ["Home_page_round_robin", 100, 0, 0.0, 399.4100000000001, 252, 1358, 319.5, 632.4000000000002, 1286.2999999999997, 1357.5899999999997, 43.365134431916736, 131.0694248699046, 13.085768104943625], "isController": false}, {"data": ["Get_position_after_group", 100, 0, 0.0, 6056.45, 2691, 8543, 6969.5, 8187.900000000001, 8327.9, 8542.51, 3.4730663702983366, 8.245140963081305, 1.2108248966762756], "isController": false}, {"data": ["Players_schedule", 100, 0, 0.0, 1571.020000000001, 577, 2737, 1510.0, 2383.3, 2581.749999999999, 2736.7799999999997, 11.107408641563923, 63.02391390369877, 3.666312618016217], "isController": false}, {"data": ["Players_Round_robin", 100, 0, 0.0, 1223.1900000000005, 105, 6932, 805.5, 4429.500000000005, 4948.149999999997, 6919.139999999994, 8.045699573577924, 19.273536185533832, 2.6557094295599], "isController": false}, {"data": ["Currency_home_page", 100, 0, 0.0, 843.56, 66, 2480, 681.5, 1703.0000000000002, 1918.95, 2476.9099999999985, 15.365703749231715, 137.440517920252, 4.81678799170252], "isController": false}, {"data": ["PlayerA_VS_playerB", 100, 0, 0.0, 1519.0500000000002, 150, 2815, 1645.0, 2494.1, 2590.95, 2814.4199999999996, 11.536686663590217, 14.465923511767421, 3.841806789340102], "isController": false}, {"data": ["Country_home_page", 100, 0, 0.0, 606.4, 138, 2591, 212.0, 2209.5, 2225.75, 2589.499999999999, 27.307482250136538, 460.5470883397051, 8.533588203167668], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2500, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
