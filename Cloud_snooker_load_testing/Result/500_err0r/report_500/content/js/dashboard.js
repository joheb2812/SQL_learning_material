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

    var data = {"OkPercent": 99.51, "KoPercent": 0.49};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.53875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.999, 500, 1500, "Knock_out"], "isController": false}, {"data": [0.008, 500, 1500, "Get_all_group"], "isController": false}, {"data": [0.636, 500, 1500, "Tournamnent_list "], "isController": false}, {"data": [0.995, 500, 1500, "Break_tab_knock_out"], "isController": false}, {"data": [0.996, 500, 1500, "Players_knock_out"], "isController": false}, {"data": [0.051, 500, 1500, "Get_knock_out_player_details"], "isController": false}, {"data": [0.038, 500, 1500, "Result_Round_robin"], "isController": false}, {"data": [0.039, 500, 1500, "Get_Knock_out"], "isController": false}, {"data": [0.883, 500, 1500, "Home_page "], "isController": false}, {"data": [0.95, 500, 1500, "Result"], "isController": false}, {"data": [0.004, 500, 1500, "Get_position_after_group"], "isController": false}, {"data": [0.952, 500, 1500, "Players_schedule"], "isController": false}, {"data": [0.069, 500, 1500, "Players_Round_robin"], "isController": false}, {"data": [0.974, 500, 1500, "Currency_home_page"], "isController": false}, {"data": [0.054, 500, 1500, "PlayerA_VS_playerB"], "isController": false}, {"data": [0.051, 500, 1500, "Players_schedule_knock_out "], "isController": false}, {"data": [0.994, 500, 1500, "Player_VS_player"], "isController": false}, {"data": [0.993, 500, 1500, "Country_home_page"], "isController": false}, {"data": [0.09, 500, 1500, "Break_tab_Round_robin"], "isController": false}, {"data": [0.999, 500, 1500, "Players"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10000, 49, 0.49, 5418.797899999982, 56, 131065, 492.0, 16572.299999999996, 21102.949999999997, 47519.22999999998, 27.66037485340001, 229.79676496357126, 9.089250499788397], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Knock_out", 500, 0, 0.0, 89.712, 58, 542, 74.5, 129.80000000000007, 188.95, 290.95000000000005, 4.235349924610771, 19.01400789045691, 1.40626852965592], "isController": false}, {"data": ["Get_all_group", 500, 8, 1.6, 13283.512000000002, 728, 73763, 11253.5, 22543.9, 29901.049999999996, 64682.69, 2.1705628269410258, 5.683364399513795, 0.7029062479650974], "isController": false}, {"data": ["Tournamnent_list ", 500, 0, 0.0, 606.8479999999998, 423, 1337, 571.5, 795.9000000000001, 905.9999999999998, 1105.0, 4.215496163898491, 369.9495721271394, 1.6013945388247197], "isController": false}, {"data": ["Break_tab_knock_out", 500, 0, 0.0, 130.30799999999996, 82, 585, 108.0, 202.7000000000001, 281.95, 512.7100000000003, 4.230011082629036, 10.137155465597319, 1.3962341268834124], "isController": false}, {"data": ["Players_knock_out", 500, 0, 0.0, 125.03999999999994, 80, 619, 105.5, 185.80000000000007, 230.95, 413.95000000000005, 4.229617473395706, 10.136212187219789, 1.396104205085692], "isController": false}, {"data": ["Get_knock_out_player_details", 500, 1, 0.2, 10538.135999999988, 61, 84937, 8317.5, 19694.9, 21130.2, 45320.50000000002, 2.182748429512505, 2.6339890355089515, 0.693508628950229], "isController": false}, {"data": ["Result_Round_robin", 500, 3, 0.6, 10447.40800000002, 237, 129992, 7578.5, 19882.600000000002, 21335.049999999996, 51068.80000000005, 2.1817198060887435, 12.334565982297526, 0.7158171549719213], "isController": false}, {"data": ["Get_Knock_out", 500, 9, 1.8, 12457.450000000008, 72, 109463, 9296.5, 20594.300000000003, 33488.14999999997, 64685.0, 2.1820435274042844, 3.5596843796777558, 0.7114655204392017], "isController": false}, {"data": ["Home_page ", 500, 0, 0.0, 546.3340000000001, 222, 8424, 294.0, 1292.900000000001, 2051.1, 3492.100000000001, 4.106135387495996, 12.406623914953723, 1.2390584323596316], "isController": false}, {"data": ["Result", 500, 0, 0.0, 349.6100000000002, 224, 979, 309.0, 502.60000000000014, 614.8499999999999, 865.8000000000002, 4.23930000678288, 24.05466590606559, 1.3993001975513804], "isController": false}, {"data": ["Get_position_after_group", 500, 3, 0.6, 13772.888000000006, 748, 78156, 11901.0, 22148.100000000002, 29840.599999999995, 64682.94, 2.1704309173543317, 5.518994627912176, 0.7521433344438705], "isController": false}, {"data": ["Players_schedule", 500, 0, 0.0, 344.37, 220, 863, 309.5, 497.0, 567.9, 714.9000000000001, 4.226578415709347, 23.98307532713717, 1.3951010786228115], "isController": false}, {"data": ["Players_Round_robin", 500, 2, 0.4, 13504.784000000001, 270, 131065, 7705.0, 38551.30000000002, 42029.4, 85078.04000000001, 2.190455746222559, 5.251677546842896, 0.7201294395061837], "isController": false}, {"data": ["Currency_home_page", 500, 0, 0.0, 149.39800000000008, 56, 1351, 73.0, 391.80000000000007, 509.5999999999999, 807.8000000000002, 4.230404765127927, 37.83864885895408, 1.3261327437559227], "isController": false}, {"data": ["PlayerA_VS_playerB", 500, 0, 0.0, 9493.241999999991, 154, 80717, 5699.0, 19853.600000000002, 21352.6, 41768.51, 2.1866717980564863, 2.741881434281766, 0.7281787921262323], "isController": false}, {"data": ["Players_schedule_knock_out ", 500, 11, 2.2, 11886.441999999992, 230, 91864, 8408.5, 23119.200000000023, 39771.2, 64692.98, 2.176051250359049, 12.173242954218058, 0.7024650444567271], "isController": false}, {"data": ["Player_VS_player", 500, 0, 0.0, 229.40999999999994, 146, 933, 196.5, 340.80000000000007, 404.84999999999997, 504.97, 4.243653616017246, 5.321143791959125, 1.4131698076776182], "isController": false}, {"data": ["Country_home_page", 500, 0, 0.0, 168.11200000000014, 109, 641, 140.0, 273.80000000000007, 327.74999999999994, 590.4000000000005, 4.228222539808716, 71.3007974691974, 1.3213195436902234], "isController": false}, {"data": ["Break_tab_Round_robin", 500, 12, 2.4, 10131.019999999997, 85, 101616, 6515.5, 21057.400000000005, 38204.24999999999, 64688.99, 2.1790575140440254, 5.202976483611309, 0.7019969972587456], "isController": false}, {"data": ["Players", 500, 0, 0.0, 121.934, 82, 526, 104.0, 180.80000000000007, 219.84999999999997, 375.98, 4.245491288251877, 10.174253536494243, 1.401343804130014], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to pabsa.impressicocrm.com:443 [pabsa.impressicocrm.com/122.187.15.6] failed: Connection timed out", 3, 6.122448979591836, 0.03], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 46, 93.87755102040816, 0.46], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10000, 49, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 46, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to pabsa.impressicocrm.com:443 [pabsa.impressicocrm.com/122.187.15.6] failed: Connection timed out", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Get_all_group", 500, 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get_knock_out_player_details", 500, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Result_Round_robin", 500, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 2, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to pabsa.impressicocrm.com:443 [pabsa.impressicocrm.com/122.187.15.6] failed: Connection timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get_Knock_out", 500, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get_position_after_group", 500, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Players_Round_robin", 500, 2, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to pabsa.impressicocrm.com:443 [pabsa.impressicocrm.com/122.187.15.6] failed: Connection timed out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Players_schedule_knock_out ", 500, 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Break_tab_Round_robin", 500, 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
