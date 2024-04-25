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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.54135, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.999, 500, 1500, "Knock_out"], "isController": false}, {"data": [0.008, 500, 1500, "Get_all_group"], "isController": false}, {"data": [0.637, 500, 1500, "Tournamnent_list "], "isController": false}, {"data": [0.997, 500, 1500, "Break_tab_knock_out"], "isController": false}, {"data": [0.999, 500, 1500, "Players_knock_out"], "isController": false}, {"data": [0.032, 500, 1500, "Get_knock_out_player_details"], "isController": false}, {"data": [0.016, 500, 1500, "Result_Round_robin"], "isController": false}, {"data": [0.04, 500, 1500, "Get_Knock_out"], "isController": false}, {"data": [0.922, 500, 1500, "Home_page "], "isController": false}, {"data": [0.982, 500, 1500, "Result"], "isController": false}, {"data": [0.003, 500, 1500, "Get_position_after_group"], "isController": false}, {"data": [0.98, 500, 1500, "Players_schedule"], "isController": false}, {"data": [0.075, 500, 1500, "Players_Round_robin"], "isController": false}, {"data": [0.982, 500, 1500, "Currency_home_page"], "isController": false}, {"data": [0.031, 500, 1500, "PlayerA_VS_playerB"], "isController": false}, {"data": [0.054, 500, 1500, "Players_schedule_knock_out "], "isController": false}, {"data": [0.999, 500, 1500, "Player_VS_player"], "isController": false}, {"data": [0.994, 500, 1500, "Country_home_page"], "isController": false}, {"data": [0.08, 500, 1500, "Break_tab_Round_robin"], "isController": false}, {"data": [0.997, 500, 1500, "Players"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10000, 0, 0.0, 4433.032500000005, 56, 34594, 473.0, 15461.8, 16796.699999999993, 18245.97, 25.48582351067219, 211.873384736381, 8.416046113411914], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Knock_out", 500, 0, 0.0, 94.44400000000003, 59, 627, 78.0, 137.60000000000014, 231.79999999999995, 389.83000000000015, 3.24321519381454, 14.558850014675548, 1.076848794821234], "isController": false}, {"data": ["Get_all_group", 500, 0, 0.0, 11432.116000000007, 681, 21332, 11748.0, 18283.100000000002, 18563.25, 18811.92, 2.37876618155695, 6.251230268134524, 0.782855667172551], "isController": false}, {"data": ["Tournamnent_list ", 500, 0, 0.0, 612.5960000000006, 423, 1424, 573.0, 834.8000000000001, 903.6999999999999, 1138.7200000000003, 3.238740518587132, 284.22827493344386, 1.2303418571585882], "isController": false}, {"data": ["Break_tab_knock_out", 500, 0, 0.0, 123.19, 80, 771, 103.5, 164.90000000000003, 273.5999999999999, 455.8900000000001, 3.2434466161121454, 7.772869136659379, 1.0705907775838917], "isController": false}, {"data": ["Players_knock_out", 500, 0, 0.0, 118.89600000000002, 81, 508, 101.0, 165.90000000000003, 241.89999999999998, 410.5900000000004, 3.24586801002324, 7.778671969333039, 1.0713900267459524], "isController": false}, {"data": ["Get_knock_out_player_details", 500, 0, 0.0, 9364.733999999999, 72, 23925, 9595.5, 16651.2, 16830.5, 17325.99, 2.2348566115998, 2.6931768151505397, 0.7114875540835299], "isController": false}, {"data": ["Result_Round_robin", 500, 0, 0.0, 9246.672000000006, 509, 21543, 9159.0, 16789.800000000003, 17206.35, 17737.92, 2.2154969581226767, 12.571240343202634, 0.7312870818803366], "isController": false}, {"data": ["Get_Knock_out", 500, 0, 0.0, 9974.794000000009, 70, 24577, 10231.0, 16742.2, 17043.05, 17504.99, 2.2608271009866248, 3.6716362001374585, 0.7506652483744654], "isController": false}, {"data": ["Home_page ", 500, 0, 0.0, 527.5479999999998, 218, 22335, 293.0, 565.6000000000001, 1381.6, 7529.6900000000005, 3.209798874002555, 9.698357144691315, 0.9685818867839742], "isController": false}, {"data": ["Result", 500, 0, 0.0, 300.00600000000003, 223, 791, 269.0, 397.90000000000003, 475.79999999999995, 608.99, 3.2399157621901833, 18.384901992548194, 1.0694253199416817], "isController": false}, {"data": ["Get_position_after_group", 500, 0, 0.0, 11757.025999999994, 1165, 19586, 12462.5, 17878.7, 18266.65, 18789.79, 2.27188048091166, 5.783976966539744, 0.7920520817240847], "isController": false}, {"data": ["Players_schedule", 500, 0, 0.0, 305.28599999999994, 222, 697, 273.0, 410.80000000000007, 476.84999999999997, 653.9100000000001, 3.240230704426155, 18.386613189359082, 1.0695292754844146], "isController": false}, {"data": ["Players_Round_robin", 500, 0, 0.0, 7930.798000000004, 262, 19291, 7432.0, 14913.000000000002, 16022.1, 18299.15, 3.215330696762162, 7.705489775248385, 1.061310327642198], "isController": false}, {"data": ["Currency_home_page", 500, 0, 0.0, 145.12800000000004, 56, 1000, 74.0, 432.50000000000017, 470.95, 728.8700000000001, 3.2476811556548624, 29.04788188264829, 1.0180719247707137], "isController": false}, {"data": ["PlayerA_VS_playerB", 500, 0, 0.0, 8297.867999999991, 240, 29655, 7169.0, 16564.4, 16963.35, 17439.53, 2.2188495708744926, 2.7822293447293447, 0.7388942418634786], "isController": false}, {"data": ["Players_schedule_knock_out ", 500, 0, 0.0, 9612.400000000005, 231, 34594, 9929.0, 16769.7, 17104.4, 18087.2, 2.5903380391141044, 14.698266092475068, 0.8550139230669602], "isController": false}, {"data": ["Player_VS_player", 500, 0, 0.0, 204.36600000000007, 144, 509, 180.0, 287.0, 323.0, 457.8700000000001, 3.2415751461950393, 4.064631335658623, 1.0794698484887777], "isController": false}, {"data": ["Country_home_page", 500, 0, 0.0, 166.59400000000014, 110, 843, 143.5, 242.50000000000017, 347.4499999999999, 518.8600000000001, 3.2502990275105312, 54.81115102433174, 1.015718446097041], "isController": false}, {"data": ["Break_tab_Round_robin", 500, 0, 0.0, 8325.810000000001, 82, 19371, 8640.5, 15484.7, 15835.25, 16294.83, 2.910191490600081, 6.974228435481055, 0.96059055060823], "isController": false}, {"data": ["Players", 500, 0, 0.0, 120.37800000000007, 81, 768, 101.0, 171.20000000000027, 248.84999999999997, 431.3500000000006, 3.243046907430469, 7.7719112410491915, 1.0704588424916979], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
