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

    var data = {"OkPercent": 99.11904761904762, "KoPercent": 0.8809523809523809};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05380952380952381, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0725, 500, 1500, "Knock_out"], "isController": false}, {"data": [0.0, 500, 1500, "Get_all_group"], "isController": false}, {"data": [0.0, 500, 1500, "Tournamnent_list "], "isController": false}, {"data": [0.0, 500, 1500, "Get_group_match_list "], "isController": false}, {"data": [0.1, 500, 1500, "Break_tab_knock_out"], "isController": false}, {"data": [0.11875, 500, 1500, "Players_knock_out"], "isController": false}, {"data": [0.0, 500, 1500, "Get_knock_out_player_details"], "isController": false}, {"data": [0.0, 500, 1500, "Result_Round_robin"], "isController": false}, {"data": [0.0, 500, 1500, "Get_Knock_out"], "isController": false}, {"data": [0.0925, 500, 1500, "Home_page "], "isController": false}, {"data": [0.025, 500, 1500, "Result"], "isController": false}, {"data": [0.0, 500, 1500, "Get_position_after_group"], "isController": false}, {"data": [0.04125, 500, 1500, "Players_schedule"], "isController": false}, {"data": [0.08875, 500, 1500, "Players_Round_robin"], "isController": false}, {"data": [0.14875, 500, 1500, "Currency_home_page"], "isController": false}, {"data": [0.00875, 500, 1500, "PlayerA_VS_playerB"], "isController": false}, {"data": [0.035, 500, 1500, "Players_schedule_knock_out "], "isController": false}, {"data": [0.07, 500, 1500, "Player_VS_player"], "isController": false}, {"data": [0.175, 500, 1500, "Country_home_page"], "isController": false}, {"data": [0.08, 500, 1500, "Break_tab_Round_robin"], "isController": false}, {"data": [0.07375, 500, 1500, "Players"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8400, 74, 0.8809523809523809, 9270.099047619033, 0, 56523, 5654.0, 24163.800000000007, 30093.649999999998, 33275.81999999999, 32.129865857810046, 277.33436310071374, 10.550538617516896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Knock_out", 400, 0, 0.0, 2828.5725000000007, 115, 14754, 2519.5, 4044.7000000000003, 6719.249999999999, 9193.7, 4.967278055807369, 22.300507516112607, 1.6492915419672904], "isController": false}, {"data": ["Get_all_group", 400, 38, 9.5, 19753.737500000017, 0, 44566, 21030.5, 33002.7, 33655.75, 34353.9, 3.536755733965234, 9.072728269951723, 1.068625218836761], "isController": false}, {"data": ["Tournamnent_list ", 400, 0, 0.0, 14650.022500000005, 1929, 48984, 12860.5, 28295.70000000001, 33955.399999999994, 42321.69000000001, 5.249481613690648, 511.9167333788289, 1.9941878395758421], "isController": false}, {"data": ["Get_group_match_list ", 400, 18, 4.5, 22477.82250000001, 2, 44141, 24196.5, 32315.9, 32835.35, 33350.7, 3.0313823861526457, 16.689329012981894, 0.99035025728858], "isController": false}, {"data": ["Break_tab_knock_out", 400, 0, 0.0, 2312.870000000001, 395, 8264, 1700.0, 3826.300000000001, 5381.049999999999, 7748.660000000002, 4.9371744550593695, 11.82703997877015, 1.6296532869238936], "isController": false}, {"data": ["Players_knock_out", 400, 0, 0.0, 2173.6100000000006, 367, 14206, 1661.5, 3868.5000000000005, 5678.8, 7255.830000000005, 4.999500049995, 11.976341428357165, 1.6502256024397561], "isController": false}, {"data": ["Get_knock_out_player_details", 400, 1, 0.25, 12357.122500000009, 184, 44802, 11269.5, 22657.800000000025, 28523.699999999997, 31834.73, 2.7167084360588714, 3.286381501422876, 0.8627273757615274], "isController": false}, {"data": ["Result_Round_robin", 400, 3, 0.75, 10718.192499999996, 202, 44334, 8060.5, 19111.200000000004, 25573.099999999995, 32002.920000000002, 2.8961372769069254, 16.34008994995113, 0.9535616831987835], "isController": false}, {"data": ["Get_Knock_out", 400, 6, 1.5, 16393.447499999987, 189, 34711, 15574.5, 30300.200000000008, 31942.45, 32879.75, 2.72364532690553, 4.408382209999864, 0.8998136856368564], "isController": false}, {"data": ["Home_page ", 400, 0, 0.0, 8010.2875, 397, 46284, 5762.0, 18300.600000000017, 22130.75, 39484.790000000015, 6.532532009406846, 19.737943395610138, 1.9712425692448394], "isController": false}, {"data": ["Result", 400, 0, 0.0, 3515.08, 281, 33280, 3276.5, 4675.4000000000015, 8030.2999999999965, 13796.200000000012, 5.058680696074464, 28.704283161232798, 1.6697598391339539], "isController": false}, {"data": ["Get_position_after_group", 400, 5, 1.25, 21440.567499999986, 163, 44492, 19498.0, 32177.0, 33056.55, 33693.83, 2.856347160433879, 6.786014186226694, 0.9858581805782676], "isController": false}, {"data": ["Players_schedule", 400, 0, 0.0, 3186.855, 542, 24449, 2668.0, 4408.300000000002, 7289.399999999997, 10861.560000000007, 4.909421179242967, 27.85662629946242, 1.6204925376798076], "isController": false}, {"data": ["Players_Round_robin", 400, 0, 0.0, 6205.43, 423, 13221, 5351.0, 11820.300000000001, 12514.25, 13176.86, 12.083862002295934, 28.946985831671807, 3.988618512476588], "isController": false}, {"data": ["Currency_home_page", 400, 0, 0.0, 3051.6625, 315, 43764, 1643.5, 8352.400000000003, 10497.599999999999, 25242.920000000053, 5.168492867479842, 46.22857245823212, 1.6202013774033492], "isController": false}, {"data": ["PlayerA_VS_playerB", 400, 3, 0.75, 8881.849999999999, 184, 45573, 7287.0, 14951.200000000008, 27426.0, 32398.06, 3.3708906735882285, 4.240977139567515, 1.1169202647413263], "isController": false}, {"data": ["Players_schedule_knock_out ", 400, 0, 0.0, 15275.927499999996, 328, 28114, 16754.0, 25423.2, 26697.45, 27843.350000000002, 4.992822817200275, 28.330734530050552, 1.6480215939586844], "isController": false}, {"data": ["Player_VS_player", 400, 0, 0.0, 2423.425000000001, 202, 6794, 2036.0, 3774.3, 3905.95, 4391.39, 5.208536791801762, 6.53101683659518, 1.734483443363673], "isController": false}, {"data": ["Country_home_page", 400, 0, 0.0, 6437.387500000002, 187, 56523, 3192.5, 15811.2, 20678.1, 33643.56000000001, 5.555401238854476, 93.68145264194051, 1.7360628871420238], "isController": false}, {"data": ["Break_tab_Round_robin", 400, 0, 0.0, 9897.362500000001, 122, 19519, 9126.5, 17866.4, 18804.999999999996, 19507.92, 7.672094673648273, 18.378562728964074, 2.5323906247003087], "isController": false}, {"data": ["Players", 400, 0, 0.0, 2680.8475000000003, 135, 8669, 2203.5, 4100.5, 4965.599999999999, 7676.410000000003, 4.999250112483127, 11.975742701094836, 1.6501431035344698], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 5, 6.756756756756757, 0.05952380952380952], "isController": false}, {"data": ["500/Internal Server Error", 12, 16.216216216216218, 0.14285714285714285], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 40, 54.054054054054056, 0.47619047619047616], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 17, 22.972972972972972, 0.20238095238095238], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8400, 74, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 40, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 17, "500/Internal Server Error", 12, "400", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Get_all_group", 400, 38, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 36, "400", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get_group_match_list ", 400, 18, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 8, "500/Internal Server Error", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 3, "400", 2, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get_knock_out_player_details", 400, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Result_Round_robin", 400, 3, "400", 1, "500/Internal Server Error", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", ""], "isController": false}, {"data": ["Get_Knock_out", 400, 6, "500/Internal Server Error", 4, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get_position_after_group", 400, 5, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PlayerA_VS_playerB", 400, 3, "500/Internal Server Error", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
