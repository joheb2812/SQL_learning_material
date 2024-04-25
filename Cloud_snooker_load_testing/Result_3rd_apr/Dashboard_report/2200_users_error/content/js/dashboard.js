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

    var data = {"OkPercent": 93.31376116440622, "KoPercent": 6.686238835593781};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10221634138273239, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.030709736123748863, 500, 1500, "Get playerA_Vs_playerB"], "isController": false}, {"data": [0.022272727272727274, 500, 1500, "Get tournamnent list "], "isController": false}, {"data": [0.012966333030027298, 500, 1500, "Get Players schedule"], "isController": false}, {"data": [0.04454545454545455, 500, 1500, "Get Home page country "], "isController": false}, {"data": [0.018198362147406732, 500, 1500, "Get Break list "], "isController": false}, {"data": [0.03434940855323021, 500, 1500, "Get Home page currency"], "isController": false}, {"data": [0.03275705186533212, 500, 1500, "Get single knockout Player details"], "isController": false}, {"data": [0.024795268425841673, 500, 1500, "Get knockout players list "], "isController": false}, {"data": [0.022975432211101002, 500, 1500, "Get Players list "], "isController": false}, {"data": [0.8693181818181818, 500, 1500, "Home page "], "isController": false}, {"data": [0.01091901728844404, 500, 1500, "Get tournament result"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24184, 1617, 6.686238835593781, 3772.190456500181, 0, 14043, 4866.5, 6021.0, 6255.0, 7607.900000000016, 90.03186705185097, 852.389903826466, 28.53846633065417], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get playerA_Vs_playerB", 2198, 226, 10.282074613284804, 3876.6251137397708, 5, 10761, 3997.5, 5799.6, 6075.199999999999, 7576.0, 8.596952345192276, 10.184294201897353, 2.7936947778794705], "isController": false}, {"data": ["Get tournamnent list ", 2200, 150, 6.818181818181818, 4212.103636363638, 0, 14043, 4802.0, 6204.8, 6439.95, 7930.409999999965, 8.945707686802642, 480.5599423726152, 3.16661691887463], "isController": false}, {"data": ["Get Players schedule", 2198, 212, 9.64513193812557, 4229.945404913564, 0, 10112, 4409.0, 6148.0, 6341.3499999999985, 7578.169999999973, 8.5687999001996, 42.05342062457117, 2.7421010944419755], "isController": false}, {"data": ["Get Home page country ", 2200, 62, 2.8181818181818183, 4065.636818181819, 0, 13694, 4611.0, 5921.0, 6158.9, 7507.639999999992, 9.12711583139728, 150.10075156094425, 2.7731393129770994], "isController": false}, {"data": ["Get Break list ", 2198, 199, 9.05368516833485, 4175.853958143763, 1, 10607, 4372.5, 6046.200000000001, 6237.15, 7547.919999999978, 8.616836938709904, 25.509118605732667, 2.774295526781584], "isController": false}, {"data": ["Get Home page currency", 2198, 168, 7.643312101910828, 3888.7361237488612, 0, 13392, 4433.0, 5931.0, 6172.049999999999, 7565.199999999995, 8.812762869320117, 74.1735497582304, 2.552697749648171], "isController": false}, {"data": ["Get single knockout Player details", 2198, 78, 3.548680618744313, 4068.063239308469, 1, 10528, 4528.0, 5800.0, 5994.0, 7290.099999999998, 8.543951985944073, 10.102888260520567, 2.6806139167683805], "isController": false}, {"data": ["Get knockout players list ", 2198, 48, 2.183803457688808, 4141.768880800729, 5, 12482, 4779.0, 5841.0, 6054.099999999999, 6439.879999999932, 8.556857554404951, 37.953894175555725, 2.780391710787558], "isController": false}, {"data": ["Get Players list ", 2198, 205, 9.326660600545951, 4103.127843494083, 0, 13007, 4348.5, 6002.0, 6248.15, 7588.459999999989, 8.700264412039456, 25.822624682844094, 2.7703403129898354], "isController": false}, {"data": ["Home page ", 2200, 92, 4.181818181818182, 529.2900000000004, 117, 7751, 287.0, 606.4000000000005, 1945.799999999992, 4827.809999999974, 9.132571732199787, 26.746824874634697, 2.6405812830017936], "isController": false}, {"data": ["Get tournament result", 2198, 177, 8.05277525022748, 4205.22747952685, 5, 9213, 4453.0, 6102.800000000001, 6317.049999999999, 7713.299999999993, 8.544350543837417, 42.33022194101172, 2.7868053584895396], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, 0.12368583797155226, 0.008269930532583526], "isController": false}, {"data": ["400", 571, 35.31230674087817, 2.3610651670525966], "isController": false}, {"data": ["401", 218, 13.481756338899196, 0.9014224280516043], "isController": false}, {"data": ["500/Internal Server Error", 17, 1.051329622758194, 0.07029440952695998], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 785, 48.54669140383426, 3.245947734039034], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 24, 1.484230055658627, 0.09923916639100232], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24184, 1617, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 785, "400", 571, "401", 218, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 24, "500/Internal Server Error", 17], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get playerA_Vs_playerB", 2198, 226, "401", 175, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 50, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get tournamnent list ", 2200, 150, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 149, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Get Players schedule", 2198, 212, "400", 147, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 61, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Get Home page country ", 2200, 62, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 59, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "500/Internal Server Error", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", ""], "isController": false}, {"data": ["Get Break list ", 2198, 199, "400", 147, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 48, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "500/Internal Server Error", 1, "", ""], "isController": false}, {"data": ["Get Home page currency", 2198, 168, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 165, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "500/Internal Server Error", 1, "", "", "", ""], "isController": false}, {"data": ["Get single knockout Player details", 2198, 78, "401", 43, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 30, "500/Internal Server Error", 4, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", ""], "isController": false}, {"data": ["Get knockout players list ", 2198, 48, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 46, "500/Internal Server Error", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", ""], "isController": false}, {"data": ["Get Players list ", 2198, 205, "400", 127, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 71, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, "500/Internal Server Error", 3, "", ""], "isController": false}, {"data": ["Home page ", 2200, 92, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 83, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["Get tournament result", 2198, 177, "400", 150, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pabsa.impressicocrm.com:443 failed to respond", 23, "500/Internal Server Error", 4, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
