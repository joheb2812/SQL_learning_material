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

    var data = {"OkPercent": 95.32457738955571, "KoPercent": 4.675422610444291};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.463866021491862, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.94375, 500, 1500, "Knock_out"], "isController": false}, {"data": [0.0018987341772151898, 500, 1500, "Get_all_group"], "isController": false}, {"data": [0.163125, 500, 1500, "Tournamnent_list "], "isController": false}, {"data": [0.969375, 500, 1500, "Break_tab_knock_out"], "isController": false}, {"data": [0.9625, 500, 1500, "Players_knock_out"], "isController": false}, {"data": [0.03934010152284264, 500, 1500, "Get_knock_out_player_details"], "isController": false}, {"data": [0.02608142493638677, 500, 1500, "Result_Round_robin"], "isController": false}, {"data": [0.012690355329949238, 500, 1500, "Get_Knock_out"], "isController": false}, {"data": [0.56125, 500, 1500, "Home_page "], "isController": false}, {"data": [0.8325, 500, 1500, "Result"], "isController": false}, {"data": [0.0, 500, 1500, "Get_position_after_group"], "isController": false}, {"data": [0.833125, 500, 1500, "Players_schedule"], "isController": false}, {"data": [0.035759096612296114, 500, 1500, "Players_Round_robin"], "isController": false}, {"data": [0.8975, 500, 1500, "Currency_home_page"], "isController": false}, {"data": [0.06942675159235669, 500, 1500, "PlayerA_VS_playerB"], "isController": false}, {"data": [0.04219143576826197, 500, 1500, "Players_schedule_knock_out "], "isController": false}, {"data": [0.956875, 500, 1500, "Player_VS_player"], "isController": false}, {"data": [0.85375, 500, 1500, "Country_home_page"], "isController": false}, {"data": [0.06344221105527638, 500, 1500, "Break_tab_Round_robin"], "isController": false}, {"data": [0.965625, 500, 1500, "Players"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15913, 744, 4.675422610444291, 6212.119839125249, 0, 66231, 716.0, 21908.6, 25764.6, 32662.86, 21.94944991889476, 179.17280652917856, 6.93501969741746], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Knock_out", 800, 0, 0.0, 235.92749999999995, 59, 4219, 133.0, 509.0, 663.249999999999, 1273.860000000001, 3.107351216139582, 13.9510093611383, 1.0317377084838457], "isController": false}, {"data": ["Get_all_group", 790, 82, 10.379746835443038, 15760.387341772137, 0, 35724, 17730.0, 30414.6, 33490.749999999985, 34973.55, 2.430552350713321, 6.236051124476585, 0.7290214873134397], "isController": false}, {"data": ["Tournamnent_list ", 800, 0, 0.0, 2250.70875, 437, 11412, 2054.0, 3844.8, 4551.099999999998, 6126.4000000000015, 3.0821390044691017, 261.7424379237941, 1.1708516335336723], "isController": false}, {"data": ["Break_tab_knock_out", 800, 0, 0.0, 201.94750000000005, 81, 8987, 100.0, 441.69999999999993, 551.6499999999995, 1121.8100000000002, 3.107483986746581, 7.447036819800888, 1.0257124878128363], "isController": false}, {"data": ["Players_knock_out", 800, 0, 0.0, 194.91249999999985, 80, 2030, 102.0, 453.9, 594.9499999999999, 1073.91, 3.1073029387317543, 7.44660294106223, 1.0256527278235672], "isController": false}, {"data": ["Get_knock_out_player_details", 788, 73, 9.263959390862944, 12684.560913705574, 0, 35428, 12001.5, 23416.9, 28289.34999999999, 33152.48, 2.3813265318457093, 3.0767703702766327, 0.692696308339478], "isController": false}, {"data": ["Result_Round_robin", 786, 73, 9.287531806615776, 12513.734096692106, 0, 38774, 10657.0, 24514.600000000013, 28006.5, 33262.8, 2.1612287657898936, 11.543752186834928, 0.6525650757392447], "isController": false}, {"data": ["Get_Knock_out", 788, 76, 9.644670050761421, 13928.401015228443, 0, 34912, 16041.0, 27217.5, 28979.299999999996, 32595.850000000002, 2.3883926541771108, 3.9856468171940027, 0.725594086151869], "isController": false}, {"data": ["Home_page ", 800, 0, 0.0, 1658.855, 224, 66231, 651.0, 3803.7999999999993, 7118.549999999977, 14031.970000000005, 3.049756781896644, 9.217770742158313, 0.9202879351621709], "isController": false}, {"data": ["Result", 800, 0, 0.0, 512.3162500000001, 215, 4674, 386.5, 907.5999999999999, 1144.599999999998, 1657.4600000000005, 3.104384943733023, 17.615300312863795, 1.0246895615056268], "isController": false}, {"data": ["Get_position_after_group", 789, 141, 17.870722433460077, 13492.318124207866, 0, 37399, 10994.0, 25707.0, 30181.0, 34907.4, 2.37578327075197, 5.82242393880175, 0.6865557748245262], "isController": false}, {"data": ["Players_schedule", 800, 0, 0.0, 521.7712499999992, 222, 8951, 386.0, 895.3999999999999, 1207.5999999999995, 1693.91, 3.105204322444417, 17.620290884866787, 1.0249600204943485], "isController": false}, {"data": ["Players_Round_robin", 797, 23, 2.8858218318695106, 13887.856963613562, 108, 36687, 10525.0, 27952.60000000001, 31827.6, 33848.46, 2.9401782552237044, 7.041894225749985, 0.9461349867378409], "isController": false}, {"data": ["Currency_home_page", 800, 0, 0.0, 328.88624999999945, 59, 2812, 216.0, 655.9, 810.299999999999, 1547.89, 3.1062412151615635, 27.784546559158365, 0.9737338184246698], "isController": false}, {"data": ["PlayerA_VS_playerB", 785, 41, 5.222929936305732, 12512.901910828017, 0, 65860, 10119.0, 27300.8, 30844.1, 33562.1, 2.0510381911149547, 2.649675267255502, 0.6551692245312006], "isController": false}, {"data": ["Players_schedule_knock_out ", 794, 83, 10.453400503778338, 13786.045340050372, 0, 34584, 10879.0, 28660.5, 31474.0, 33256.6, 2.5993413255986013, 13.741489709644735, 0.7791028937314626], "isController": false}, {"data": ["Player_VS_player", 800, 0, 0.0, 263.9662499999999, 141, 2311, 175.0, 468.9, 725.9499999999999, 1045.96, 3.1060723714862553, 3.894723559558938, 1.0343463658953254], "isController": false}, {"data": ["Country_home_page", 800, 0, 0.0, 419.405, 116, 5147, 279.5, 823.4999999999999, 1092.249999999999, 1927.98, 3.1136279603790844, 52.50961378242552, 0.9730087376184638], "isController": false}, {"data": ["Break_tab_Round_robin", 796, 152, 19.09547738693467, 9664.61432160804, 0, 33624, 7484.5, 22493.600000000002, 23298.4, 31781.059999999994, 2.7746502929765793, 6.470952444027705, 0.7432663097848252], "isController": false}, {"data": ["Players", 800, 0, 0.0, 186.4362500000003, 80, 2760, 99.0, 442.9, 577.7499999999997, 964.7600000000002, 3.107278800590383, 7.446545094383594, 1.0256447603511225], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, 2.0161290322580645, 0.09426255262992522], "isController": false}, {"data": ["500/Internal Server Error", 62, 8.333333333333334, 0.38961855087035757], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 578, 77.68817204301075, 3.632250361339785], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 89, 11.96236559139785, 0.559291145604223], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15913, 744, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 578, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 89, "500/Internal Server Error", 62, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 15, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Get_all_group", 790, 82, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 54, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 14, "500/Internal Server Error", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get_knock_out_player_details", 788, 73, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 53, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 13, "500/Internal Server Error", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, {"data": ["Result_Round_robin", 786, 73, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 55, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 11, "500/Internal Server Error", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": ["Get_Knock_out", 788, 76, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 52, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 12, "500/Internal Server Error", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get_position_after_group", 789, 141, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 129, "500/Internal Server Error", 6, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Players_Round_robin", 797, 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 10, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 9, "500/Internal Server Error", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["PlayerA_VS_playerB", 785, 41, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 20, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 11, "500/Internal Server Error", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": ["Players_schedule_knock_out ", 794, 83, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 62, "500/Internal Server Error", 10, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Break_tab_Round_robin", 796, 152, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 143, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "500/Internal Server Error", 2, "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
