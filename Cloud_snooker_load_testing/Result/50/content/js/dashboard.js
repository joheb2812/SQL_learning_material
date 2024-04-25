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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6056, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Get_all_group"], "isController": false}, {"data": [0.39, 500, 1500, "Tournamnent_list "], "isController": false}, {"data": [0.03, 500, 1500, "Get_group_match_list "], "isController": false}, {"data": [0.92, 500, 1500, "Break_tab_knock_out"], "isController": false}, {"data": [0.53, 500, 1500, "Result_Round_robin"], "isController": false}, {"data": [0.89, 500, 1500, "Country_home_page_Round_robin"], "isController": false}, {"data": [0.36, 500, 1500, "Get_Knock_out"], "isController": false}, {"data": [0.82, 500, 1500, "Home_page "], "isController": false}, {"data": [0.53, 500, 1500, "Result"], "isController": false}, {"data": [0.27, 500, 1500, "Players_schedule_knock_out "], "isController": false}, {"data": [0.83, 500, 1500, "Currency_home_page_round_robin"], "isController": false}, {"data": [0.65, 500, 1500, "Player_VS_player"], "isController": false}, {"data": [0.73, 500, 1500, "Break_tab_Round_robin"], "isController": false}, {"data": [0.76, 500, 1500, "Players"], "isController": false}, {"data": [0.2, 500, 1500, "Tournamnent_list_round_robin"], "isController": false}, {"data": [0.86, 500, 1500, "Knock_out"], "isController": false}, {"data": [0.97, 500, 1500, "Players_knock_out"], "isController": false}, {"data": [0.52, 500, 1500, "Get_knock_out_player_details"], "isController": false}, {"data": [0.9, 500, 1500, "Home_page_round_robin"], "isController": false}, {"data": [0.04, 500, 1500, "Get_position_after_group"], "isController": false}, {"data": [0.53, 500, 1500, "Players_schedule"], "isController": false}, {"data": [0.91, 500, 1500, "Players_Round_robin"], "isController": false}, {"data": [0.92, 500, 1500, "Currency_home_page"], "isController": false}, {"data": [0.61, 500, 1500, "PlayerA_VS_playerB"], "isController": false}, {"data": [0.97, 500, 1500, "Country_home_page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1250, 0, 0.0, 1040.6400000000008, 60, 7454, 632.0, 2901.0000000000073, 3734.1500000000005, 5085.05, 30.699707738782326, 385.44149825318664, 10.132102761131714], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get_all_group", 50, 0, 0.0, 3952.6600000000008, 1746, 6922, 4003.0, 5216.3, 5318.55, 6922.0, 2.42600679281902, 6.375375272925765, 0.8055100679281902], "isController": false}, {"data": ["Tournamnent_list ", 50, 0, 0.0, 1183.3799999999994, 664, 1901, 1099.0, 1565.7, 1755.3999999999996, 1901.0, 8.755034144633164, 880.0662920241639, 3.325886994396778], "isController": false}, {"data": ["Get_group_match_list ", 50, 0, 0.0, 3277.2, 267, 5700, 3355.0, 4099.4, 4992.949999999994, 5700.0, 2.613559144843448, 14.828987474517799, 0.8779925252208457], "isController": false}, {"data": ["Break_tab_knock_out", 50, 0, 0.0, 300.78, 87, 787, 334.0, 540.6999999999999, 583.8499999999998, 787.0, 8.231807704972011, 19.71935966825815, 2.717139652617715], "isController": false}, {"data": ["Result_Round_robin", 50, 0, 0.0, 1092.72, 231, 1718, 1204.5, 1455.5, 1594.2999999999993, 1718.0, 5.97300203082069, 33.89212011707084, 1.9715573109544857], "isController": false}, {"data": ["Country_home_page_Round_robin", 50, 0, 0.0, 340.6, 126, 3060, 178.0, 578.3, 890.1499999999988, 3060.0, 4.999500049995, 84.30895191730828, 1.5623437656234378], "isController": false}, {"data": ["Get_Knock_out", 50, 0, 0.0, 1224.4399999999996, 84, 2475, 1059.5, 2355.1, 2425.4999999999995, 2475.0, 4.080300310102824, 6.626503335645504, 1.3547872123388283], "isController": false}, {"data": ["Home_page ", 50, 0, 0.0, 553.5, 251, 3362, 333.0, 766.9, 2251.949999999992, 3362.0, 12.936610608020699, 39.10040022639068, 3.903723318240621], "isController": false}, {"data": ["Result", 50, 0, 0.0, 927.6800000000002, 231, 1358, 970.0, 1143.8, 1192.7499999999998, 1358.0, 8.632596685082873, 48.98121870683702, 2.8494313276933703], "isController": false}, {"data": ["Players_schedule_knock_out ", 50, 0, 0.0, 1794.7599999999998, 251, 4526, 1857.5, 3547.3999999999996, 4019.8999999999987, 4526.0, 2.713115198871344, 15.395445018720496, 0.8955399777524554], "isController": false}, {"data": ["Currency_home_page_round_robin", 50, 0, 0.0, 428.74, 64, 2915, 272.5, 811.3999999999999, 1704.3499999999951, 2915.0, 3.13302838523717, 28.023776258694156, 0.9821309684190739], "isController": false}, {"data": ["Player_VS_player", 50, 0, 0.0, 628.3999999999997, 153, 966, 732.0, 916.4, 939.4, 966.0, 10.17915309446254, 12.76370368485342, 3.3897375050895766], "isController": false}, {"data": ["Break_tab_Round_robin", 50, 0, 0.0, 675.22, 114, 3073, 231.5, 2006.4999999999995, 2709.9499999999975, 3073.0, 2.854858969966884, 6.838836966141373, 0.9423264959461003], "isController": false}, {"data": ["Players", 50, 0, 0.0, 499.9199999999999, 96, 936, 490.5, 690.5, 762.2999999999998, 936.0, 8.433125316242199, 20.20161757884972, 2.7835901922752573], "isController": false}, {"data": ["Tournamnent_list_round_robin", 50, 0, 0.0, 1585.5399999999995, 619, 4445, 1572.5, 2126.4, 2362.0999999999995, 4445.0, 3.5058196606366567, 352.40855288528957, 1.3318006328004488], "isController": false}, {"data": ["Knock_out", 50, 0, 0.0, 429.40000000000003, 69, 761, 419.5, 577.6, 704.2499999999999, 761.0, 8.067118425298483, 36.2210466077767, 2.678535414649887], "isController": false}, {"data": ["Players_knock_out", 50, 0, 0.0, 245.01999999999995, 86, 751, 152.0, 472.7, 681.2499999999997, 751.0, 8.960573476702509, 21.465123767921146, 2.9576892921146953], "isController": false}, {"data": ["Get_knock_out_player_details", 50, 0, 0.0, 817.8000000000004, 60, 1863, 733.5, 1416.8, 1856.5, 1863.0, 5.062265870203503, 6.100425863116331, 1.6116197985218184], "isController": false}, {"data": ["Home_page_round_robin", 50, 0, 0.0, 653.3599999999999, 234, 7454, 328.0, 1307.8, 2723.149999999987, 7454.0, 6.654245408570668, 20.112196815943573, 2.0079705383284536], "isController": false}, {"data": ["Get_position_after_group", 50, 0, 0.0, 2951.3000000000006, 375, 4644, 3177.5, 4138.3, 4364.55, 4644.0, 2.997961386257345, 7.117230595694927, 1.045187709857297], "isController": false}, {"data": ["Players_schedule", 50, 0, 0.0, 807.68, 304, 1076, 843.5, 996.8, 1046.45, 1076.0, 7.6923076923076925, 43.64783653846154, 2.5390625], "isController": false}, {"data": ["Players_Round_robin", 50, 0, 0.0, 357.08, 89, 3702, 197.0, 616.6999999999999, 1817.5499999999988, 3702.0, 2.9496784850451303, 7.065977855288773, 0.973624343696537], "isController": false}, {"data": ["Currency_home_page", 50, 0, 0.0, 288.3, 60, 852, 214.5, 696.9999999999999, 781.7499999999999, 852.0, 9.071117561683598, 81.13778035422715, 2.8435827512699565], "isController": false}, {"data": ["PlayerA_VS_playerB", 50, 0, 0.0, 780.3600000000001, 155, 1597, 851.5, 1225.5, 1538.6, 1597.0, 6.987143655673561, 8.761223099496926, 2.326773424399106], "isController": false}, {"data": ["Country_home_page", 50, 0, 0.0, 220.16000000000003, 129, 806, 165.0, 410.7999999999999, 556.9499999999996, 806.0, 11.389521640091116, 192.06693123576312, 3.559225512528474], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1250, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
