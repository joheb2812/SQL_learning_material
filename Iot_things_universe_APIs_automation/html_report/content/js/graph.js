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
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 15.0, "series": [{"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_87-Verify update tickets by ID when ticket ID is invalid", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download policies-TC_AM_A_127-Verify download privacy policies file content with uploaded file content ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_59-Verify that API reponse is negative for Missing faq path variable", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_102-Verify get all ticket with invalid page size in request param (Use non-numeric value ex: xyz, negative number ex: -1,-2 etc )", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_8-Verify that API response is negative if question field is set to null", "isController": false}, {"data": [[400.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_54-Verify create ticket response with all valid input ", "isController": false}, {"data": [[400.0, 1.0]], "isOverall": false, "label": "Download logs-TC_AM_A_116-Verify download log response content with uploaded file content ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_92-Verify delete tickets by ID with invalid ticket ID ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_98-Verify get all ticket with unregister tenantID value", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_08-Verify feedback creation when subject field value is null ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_33-Verify delete feedback with valid input ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_27-Verify get feedback by ID when accept field is invalid in request header ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_72-Verify get ticket by ID when accept key value is invalid in request headers ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_35-Verify that API response is negative if category field is set to null", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_2-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_56-Verify that API reponse is negative for invalid category param", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_3-Verify that api is not executed successfully , when invalid/wrong\ncontent type header is there OR content header not present", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Download logs-TC_AM_A_113-Verify that requested file exist by inspecting the response body and headers ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_10-Verify feedback creation when user ID field value is null ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_38-Verify delete feedback when content-type is invalid in request headers", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_75-Verify update ticket by ID when \"description\" field is missing from request payload ", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Download logs", "isController": false}, {"data": [[400.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_07-Verify feedback creation by passing extra field in payload ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_13-Verify feedback creation by passing integer value in subject field", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_19-Verify that api response is according to req. \nwith missing tenant header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_69-Verify get ticket by ID with unregister tenantID value", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_15-Verify feedback creation by passing invalid userID value in userId field", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_9-Verify that API response is negative if answer field is set to null", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_24-Verify that FAQ is updated succesfully when answer data is changed", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_41-Verify that API reponse is negative for Missing category param", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_40-Verify that API reponse is negative for invalid category param", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download file ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_31-Verify fetch all feedback by missing pageNum and pageSize parameter", "isController": false}, {"data": [[400.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_06-Verify feedback creation with missing rating field", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_88-Verify update tickets by ID with unregister ticket ID ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_39-Verify that API response is negative if category field is missing", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Download file-TC_AM_A_47-Verify download file response with all valid input", "isController": false}, {"data": [[100.0, 6.0], [200.0, 1.0]], "isOverall": false, "label": "Get_faq", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_118-Verify upload privacy policies file response by sending unregister X-TANANTID in request header", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_90-Verify update tickets by ID when Content-type key value is invalid in request payload ", "isController": false}, {"data": [[500.0, 1.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_107-Verify upload log response when X-TANENTID field is missing in request header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_47-Verify that api response is according to req. \nwith missing tenant header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_103-Verify get all ticket with minimum page number and page size in request param (Ex: 1,1)", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_63-Verify create tickets by sending unregister X-TENANTID", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_53-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[100.0, 4.0]], "isOverall": false, "label": "Download policies-TC_AM_A_125-Verify download privacy policies file with invalid file name ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_86-Verify update tickets by ID when X-TENANTID field is missing", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_52-Verify that API response is Successful if all headers and payload is accurate and as per req.", "isController": false}, {"data": [[300.0, 1.0], [100.0, 6.0], [200.0, 1.0]], "isOverall": false, "label": "Create_Faqs", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_57-Verify that API reponse is negative for Missing category param", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_04-Verify feedback creation with missing content field", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_30-Verify that faq order field does not take any other input than integer", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_79-Verify update ticket by ID when \"status\" field is null in request payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_91-Verify delete tickets by ID with all valid input", "isController": false}, {"data": [[400.0, 1.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_97-Verify get all ticket with all valid input ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_96-Verify delete tickets by ID when accept key value is invalid in request headers ", "isController": false}, {"data": [[0.0, 1.0]], "isOverall": false, "label": "Upload file-TC_AM_A_45-Verify upload file response by sending blank file in request payload ", "isController": false}, {"data": [[100.0, 7.0], [200.0, 2.0]], "isOverall": false, "label": "Get_ticket", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_11-Verify feedback creation when rating field value is null ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_43-Verify that API reponse is negative for Missing faq path var", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_42-Verify that API reponse is negative for faq param not in db", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_56-Verify create ticket when \"description\" field is missing from request payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download file-TC_AM_A_49-Verify download file response with invalid file name ", "isController": false}, {"data": [[1000.0, 1.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_103-Verify upload logs with all valid inputs ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_59-Verify create ticket by sending empty payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_45-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_93-Verify delete tickets by ID with unregister ticket ID ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_24-Verify get feedback by ID with non-register ID ", "isController": false}, {"data": [[100.0, 2.0], [200.0, 5.0]], "isOverall": false, "label": "Delete_faq", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_25-Verify that FAQ is updated succesfully when category data is changed", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_28-Verify that api response is according to req. after passing unregistered\ntenant name as header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_Faq", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_58-Verify that API reponse is negative for faq param that is not in db", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_17-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Download policies-TC_AM_A_124-Verify download privacy policies file with all valid input", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download policies-TC_AM_A_128-Verify download privacy policies file with missing X-TANANTID in request header", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_11-Verify that API response is negative if category field is set to null", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_81-Verify update ticket by ID when subject field is integer in request body ", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_03-Verify feedback creation with missing subject field", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_02-Verify feedback creation by passing empty payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download file-TC_AM_A_52-Verify download file response content with uploaded file content ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_95-Verify delete tickets by ID when tenant ID field is missing in request header ", "isController": false}, {"data": [[200.0, 2.0], [100.0, 4.0]], "isOverall": false, "label": "Delete Faq", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_26-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_68-Verify get ticket by ID with invalid ticket ID ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_121-Verify upload privacy policies file response by sending other than .html file in payload ", "isController": false}, {"data": [[100.0, 4.0], [200.0, 1.0]], "isOverall": false, "label": "Delete feedback", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Download file-TC_AM_A_50-Verify download file response with unregister X-TANANTID in request header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_29-Verify get all feedback by passing non-register X-TANANTID ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_14-Verify feedback creation by passing integer value in content field", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_76-Verify update ticket by ID when \"Status\" field is missing from request payload ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_77-Verify update ticket by ID when \"subject\" field is null in request payload ", "isController": false}, {"data": [[400.0, 1.0]], "isOverall": false, "label": "Download logs-TC_AM_A_112-Verify download log response with all valid input", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_118-Verify upload privacy policies file response by sending other than .html file in payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_31-Verify that Category field does not accept any other input that mobile / web", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_65-Verify create tickets when accept key value is invalid in request headers", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_36-Verify delete feedback when X-TENANTID value is null in request header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_20-Verify that API reponse is negative for invalid category param", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_32-Verify fetch all feedback when accept is invalid in request header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download logs-TC_AM_A_115-Verify download log response with unregister X-TANENTID in request header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_83-Verify update ticket by ID status field will not accept other than ON_HOLD, IN_PROGRESS, CLOSED, OPEN values ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_12-Verify feedback creation by passing duplicate field value and verify response ID ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_34-Verify that API response is negative if faq order field is set to null", "isController": false}, {"data": [[200.0, 15.0], [100.0, 15.0]], "isOverall": false, "label": "Create_faq", "isController": false}, {"data": [[100.0, 5.0]], "isOverall": false, "label": "Get_Faq_by_ID", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_62-Verify create tickets by sending additional field in request payload ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_09-Verify feedback creation when content field value is null ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_48-Verify that API reponse is negative for invalid category param", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_44-Verify that API response is Successful if all headers and payload is accurate and as per req.", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_12-Verify that API response is negative if question field is missing", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_32-Verify that API response is negative if question field is set to null", "isController": false}, {"data": [[100.0, 1.0], [200.0, 1.0]], "isOverall": false, "label": "Get_Feedback", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_55-Verify create ticket when \"subject\" field is missing from request payload ", "isController": false}, {"data": [[100.0, 4.0], [200.0, 1.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_104-Verify upload log response by sending other than .log file in payload ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_23-Verify that FAQ is updated succesfully when question data is changed", "isController": false}, {"data": [[800.0, 2.0], [400.0, 2.0], [500.0, 2.0]], "isOverall": false, "label": "Upload logs", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_10-Verify that API response is negative if faq order field is set to null", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_120-Verify upload privacy policies file response when invalid accept header in request header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_74-Verify update ticket by ID when \"subject\" field is missing from request payload ", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_16-Verify feedback creation by passing unregister userID value in userId field", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_80-Verify update ticket by ID when request payload is empty", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_84-Verify update ticket by ID by sending additional field in request payload ", "isController": false}, {"data": [[700.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_13-Verify that API response is negative if answer field is missing", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_117-Verify upload privacy policies file response with all valid input", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_70-Verify get ticket by ID with null tenantID value", "isController": false}, {"data": [[400.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_05-Verify feedback creation with missing userID field", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_22-Verify get feedback by ID with all valid input \n", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_58-Verify create ticket when \"description\" field is null in request payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_64-Verify create tickets by using registered field value\n(Ticket ID will generate unique for duplicate field value )", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_94-Verify delete tickets by ID with unregister tenant ID ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_38-Verify that API response is negative if faq order field is missing", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_73-Verify update ticket by ID with all valid input ", "isController": false}, {"data": [[300.0, 3.0], [600.0, 1.0], [200.0, 2.0], [400.0, 1.0], [100.0, 4.0], [500.0, 1.0]], "isOverall": false, "label": "Create fb", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_01-To verify feedback creation with all valid inputs", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Download privacy policies", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_35-Verify delete feedback with non-register ID ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_18-Verify feedback creation null X-TENANTID in request header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_61-Verify create tickets by sending integer value in request \"description\" field", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_33-Verify that API response is negative if answer field is set to null", "isController": false}, {"data": [[400.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_17-Verify feedback creation rating field accept only integer (0-5) value ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_4-Verify that api response is according to req. after passing unregistered tenant name as header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_67-Verify get ticket by ID with all valid input ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_23-Verify get feedback by ID with invalid ID ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_57-Verify create ticket when \"subject\" field is null in request payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_82-Verify update ticket by ID when \"description\" field is integer in request body", "isController": false}, {"data": [[300.0, 1.0], [100.0, 4.0], [200.0, 3.0]], "isOverall": false, "label": "Upload file", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_51-Verify that API reponse is negative for invalid faq path varibale", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_66-Verify create tickets when content-type key value is invalid in request headers", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_18-Verify that api response is according to req. after passing unregistered\ntenant name as header", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_27-Verify that api is not executed successfully , when invalid/wrong\ncontent type header is there OR content header not present", "isController": false}, {"data": [[200.0, 7.0], [100.0, 1.0]], "isOverall": false, "label": "Delete_ticket", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_26-Verify get feedback by ID when X-TANANTID field is not present in request header ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_49-Verify that API reponse is negative for Missing category param", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_21-Verify that API reponse is negative for Missing category param", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download file-TC_AM_A_48-Verify that requested file exist by inspecting the response body and headers ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_36-Verify that API response is negative if question field is missing", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Upload file-TC_AM_A_46-Verify upload file response by sending unregister X-TANANTID in request header", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_101-Verify get all ticket with invalid page number in request param (Use non-numeric value ex: abc, negative number ex: -1,-2 etc )", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_50-Verify that API reponse is negative for unregistered faq id param", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_54-Verify that api response is according to req. after passing unregistered\ntenant name as header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_99-Verify get all ticket with null tenantID value", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_5-Verify that api response is according to req. With missing tenant header", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_22-Verify that FAQ is updated succesfully when faq order data is changed", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Upload file-TC_AM_A_43-Verify upload file response with all valid input", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_71-Verify get ticket by ID with missing tenantID field", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_29-Verify that api response is according to req. \nwith missing tenant header", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_28-Verify fetch all feedback with valid input", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_120-Verify upload privacy policies file response by sending other than .html file in payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download policies-TC_AM_A_126-Verify download privacy policies file response with unregister X-TANANTID in request header", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_1-Verify that API response is Successful if all headers and payload is accurate and as per req. ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_37-Verify that API response is negative if answer field is missing", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_46-Verify that api response is according to req. after passing unregistered\ntenant name as header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_6-Verify that faq order field does not take any other input than integer", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_34-Verify delete feedback with invalid ID ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_30-Verify fetch all feedback by passing invalid pageNum and pageSize in request param", "isController": false}, {"data": [[100.0, 2.0], [200.0, 2.0]], "isOverall": false, "label": "Get feedback", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_16-Verify that API response is Successful if all headers and payload is accurate and as per requirement", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Download file-TC_AM_A_53-Verify download file response with missing X-TANANTID in request header", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_19-Verify feedback creation with unregister X-TENANTID ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_14-Verify that API response is negative if faq order field is missing", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download file-TC_AM_A_51-Verify download file response with invalid file name ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_119-Verify upload privacy policies file response when X-TANANTID field is not present in request header", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_55-Verify that api response is according to req. \nwith missing tenant header", "isController": false}, {"data": [[300.0, 6.0], [100.0, 11.0], [200.0, 13.0]], "isOverall": false, "label": "Create_tickets", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_15-Verify that API response is negative if category field is missing", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_89-Verify update tickets by ID when accept key value is invalid in request payload ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_7-Verify that Category field does not accept any other input than mobile / web", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_78-Verify update ticket by ID when \"description\" field is null in request payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_37-Verify delete feedback with already deleted ID ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_25-Verify get feedback by ID when X-TANANTID value is missing in request header ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_60-Verify create tickets by sending integer value in request subject field", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Download logs-TC_AM_A_114-Verify download log response with invalid file name ", "isController": false}, {"data": [[200.0, 1.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_85-Verify update tickets by ID with unregister X-TENANTID ", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_20-Verify feedback creation when Content-type is invalid in request header", "isController": false}, {"data": [[1200.0, 1.0], [200.0, 2.0], [100.0, 2.0]], "isOverall": false, "label": "Upload file-TC_AM_A_44-Verify upload file response by sending other than .html file in payload ", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_119-Verify upload privacy policies file response by sending other than .html file in payload ", "isController": false}, {"data": [[300.0, 1.0], [100.0, 7.0], [200.0, 1.0]], "isOverall": false, "label": "Upload poilicies", "isController": false}, {"data": [[100.0, 1.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_100-Verify get all ticket with missing tenantID field", "isController": false}, {"data": [[300.0, 1.0]], "isOverall": false, "label": "Create fb-TC_AM_A_21-Verify feedback creation when accept is invalid request header", "isController": false}, {"data": [[600.0, 1.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_106-Verify upload log response by sending unregister X-TANENTID in request header", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 1200.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 11.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 314.0, "series": [{"data": [[0.0, 314.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 11.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [[3.0, 26.0]], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 3.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 1.0, "minX": 1.68836412E12, "maxY": 1.0, "series": [{"data": [[1.68836418E12, 1.0]], "isOverall": false, "label": "Update_faq_by_Id", "isController": false}, {"data": [[1.68836418E12, 1.0]], "isOverall": false, "label": "Get_faqs_by_Id", "isController": false}, {"data": [[1.68836418E12, 1.0]], "isOverall": false, "label": "Update_ticket_by_Id", "isController": false}, {"data": [[1.68836412E12, 1.0], [1.68836418E12, 1.0]], "isOverall": false, "label": "Create_FAQs", "isController": false}, {"data": [[1.68836412E12, 1.0]], "isOverall": false, "label": "Get_fb_by_Id", "isController": false}, {"data": [[1.68836412E12, 1.0]], "isOverall": false, "label": "Get_all_feedback", "isController": false}, {"data": [[1.68836412E12, 1.0]], "isOverall": false, "label": "Delete_fb_by_Id", "isController": false}, {"data": [[1.68836418E12, 1.0]], "isOverall": false, "label": "Get_ticket_info_by_Id", "isController": false}, {"data": [[1.68836412E12, 1.0]], "isOverall": false, "label": "Create_feedback", "isController": false}, {"data": [[1.68836424E12, 1.0]], "isOverall": false, "label": "Privacy_policies_upload ", "isController": false}, {"data": [[1.68836418E12, 1.0]], "isOverall": false, "label": "Get_all_faqs", "isController": false}, {"data": [[1.68836424E12, 1.0]], "isOverall": false, "label": "Mobile_logs_upload", "isController": false}, {"data": [[1.68836424E12, 1.0]], "isOverall": false, "label": "Mobile_logs_download", "isController": false}, {"data": [[1.68836424E12, 1.0]], "isOverall": false, "label": "TnC_upload", "isController": false}, {"data": [[1.68836424E12, 1.0]], "isOverall": false, "label": "Privacy_policies_download", "isController": false}, {"data": [[1.68836424E12, 1.0]], "isOverall": false, "label": "TnC_download", "isController": false}, {"data": [[1.68836418E12, 1.0]], "isOverall": false, "label": "Create_tickets", "isController": false}, {"data": [[1.68836418E12, 1.0]], "isOverall": false, "label": "Delete_faq_by_Id", "isController": false}, {"data": [[1.68836418E12, 1.0]], "isOverall": false, "label": "Get_all_tickets", "isController": false}, {"data": [[1.68836424E12, 1.0], [1.68836418E12, 1.0]], "isOverall": false, "label": "Delete_tickets_by_Id", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.68836424E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 0.0, "minX": 1.0, "maxY": 1039.0, "series": [{"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_87-Verify update tickets by ID when ticket ID is invalid", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_87-Verify update tickets by ID when ticket ID is invalid-Aggregated", "isController": false}, {"data": [[1.0, 143.0]], "isOverall": false, "label": "Download policies-TC_AM_A_127-Verify download privacy policies file content with uploaded file content ", "isController": false}, {"data": [[1.0, 143.0]], "isOverall": false, "label": "Download policies-TC_AM_A_127-Verify download privacy policies file content with uploaded file content -Aggregated", "isController": false}, {"data": [[1.0, 215.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_59-Verify that API reponse is negative for Missing faq path variable", "isController": false}, {"data": [[1.0, 215.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_59-Verify that API reponse is negative for Missing faq path variable-Aggregated", "isController": false}, {"data": [[1.0, 139.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_102-Verify get all ticket with invalid page size in request param (Use non-numeric value ex: xyz, negative number ex: -1,-2 etc )", "isController": false}, {"data": [[1.0, 139.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_102-Verify get all ticket with invalid page size in request param (Use non-numeric value ex: xyz, negative number ex: -1,-2 etc )-Aggregated", "isController": false}, {"data": [[1.0, 198.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_8-Verify that API response is negative if question field is set to null", "isController": false}, {"data": [[1.0, 198.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_8-Verify that API response is negative if question field is set to null-Aggregated", "isController": false}, {"data": [[1.0, 422.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_54-Verify create ticket response with all valid input ", "isController": false}, {"data": [[1.0, 422.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_54-Verify create ticket response with all valid input -Aggregated", "isController": false}, {"data": [[1.0, 469.0]], "isOverall": false, "label": "Download logs-TC_AM_A_116-Verify download log response content with uploaded file content ", "isController": false}, {"data": [[1.0, 469.0]], "isOverall": false, "label": "Download logs-TC_AM_A_116-Verify download log response content with uploaded file content -Aggregated", "isController": false}, {"data": [[1.0, 189.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_92-Verify delete tickets by ID with invalid ticket ID ", "isController": false}, {"data": [[1.0, 189.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_92-Verify delete tickets by ID with invalid ticket ID -Aggregated", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_98-Verify get all ticket with unregister tenantID value", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_98-Verify get all ticket with unregister tenantID value-Aggregated", "isController": false}, {"data": [[1.0, 240.0]], "isOverall": false, "label": "Create fb-TC_AM_A_08-Verify feedback creation when subject field value is null ", "isController": false}, {"data": [[1.0, 240.0]], "isOverall": false, "label": "Create fb-TC_AM_A_08-Verify feedback creation when subject field value is null -Aggregated", "isController": false}, {"data": [[1.0, 167.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_33-Verify delete feedback with valid input ", "isController": false}, {"data": [[1.0, 167.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_33-Verify delete feedback with valid input -Aggregated", "isController": false}, {"data": [[1.0, 146.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_27-Verify get feedback by ID when accept field is invalid in request header ", "isController": false}, {"data": [[1.0, 146.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_27-Verify get feedback by ID when accept field is invalid in request header -Aggregated", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_72-Verify get ticket by ID when accept key value is invalid in request headers ", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_72-Verify get ticket by ID when accept key value is invalid in request headers -Aggregated", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_35-Verify that API response is negative if category field is set to null", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_35-Verify that API response is negative if category field is set to null-Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_2-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_2-Verify that api is not executed successfully , when inavild accept type is present-Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_56-Verify that API reponse is negative for invalid category param", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_56-Verify that API reponse is negative for invalid category param-Aggregated", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_3-Verify that api is not executed successfully , when invalid/wrong\ncontent type header is there OR content header not present", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_3-Verify that api is not executed successfully , when invalid/wrong\ncontent type header is there OR content header not present-Aggregated", "isController": false}, {"data": [[1.0, 264.0]], "isOverall": false, "label": "Download logs-TC_AM_A_113-Verify that requested file exist by inspecting the response body and headers ", "isController": false}, {"data": [[1.0, 264.0]], "isOverall": false, "label": "Download logs-TC_AM_A_113-Verify that requested file exist by inspecting the response body and headers -Aggregated", "isController": false}, {"data": [[1.0, 230.0]], "isOverall": false, "label": "Create fb-TC_AM_A_10-Verify feedback creation when user ID field value is null ", "isController": false}, {"data": [[1.0, 230.0]], "isOverall": false, "label": "Create fb-TC_AM_A_10-Verify feedback creation when user ID field value is null -Aggregated", "isController": false}, {"data": [[1.0, 230.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_38-Verify delete feedback when content-type is invalid in request headers", "isController": false}, {"data": [[1.0, 230.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_38-Verify delete feedback when content-type is invalid in request headers-Aggregated", "isController": false}, {"data": [[1.0, 173.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_75-Verify update ticket by ID when \"description\" field is missing from request payload ", "isController": false}, {"data": [[1.0, 173.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_75-Verify update ticket by ID when \"description\" field is missing from request payload -Aggregated", "isController": false}, {"data": [[1.0, 363.0]], "isOverall": false, "label": "Download logs", "isController": false}, {"data": [[1.0, 363.0]], "isOverall": false, "label": "Download logs-Aggregated", "isController": false}, {"data": [[1.0, 404.0]], "isOverall": false, "label": "Create fb-TC_AM_A_07-Verify feedback creation by passing extra field in payload ", "isController": false}, {"data": [[1.0, 404.0]], "isOverall": false, "label": "Create fb-TC_AM_A_07-Verify feedback creation by passing extra field in payload -Aggregated", "isController": false}, {"data": [[1.0, 234.0]], "isOverall": false, "label": "Create fb-TC_AM_A_13-Verify feedback creation by passing integer value in subject field", "isController": false}, {"data": [[1.0, 234.0]], "isOverall": false, "label": "Create fb-TC_AM_A_13-Verify feedback creation by passing integer value in subject field-Aggregated", "isController": false}, {"data": [[1.0, 119.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_19-Verify that api response is according to req. \nwith missing tenant header", "isController": false}, {"data": [[1.0, 119.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_19-Verify that api response is according to req. \nwith missing tenant header-Aggregated", "isController": false}, {"data": [[1.0, 179.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_69-Verify get ticket by ID with unregister tenantID value", "isController": false}, {"data": [[1.0, 179.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_69-Verify get ticket by ID with unregister tenantID value-Aggregated", "isController": false}, {"data": [[1.0, 266.0]], "isOverall": false, "label": "Create fb-TC_AM_A_15-Verify feedback creation by passing invalid userID value in userId field", "isController": false}, {"data": [[1.0, 266.0]], "isOverall": false, "label": "Create fb-TC_AM_A_15-Verify feedback creation by passing invalid userID value in userId field-Aggregated", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_9-Verify that API response is negative if answer field is set to null", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_9-Verify that API response is negative if answer field is set to null-Aggregated", "isController": false}, {"data": [[1.0, 182.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_24-Verify that FAQ is updated succesfully when answer data is changed", "isController": false}, {"data": [[1.0, 182.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_24-Verify that FAQ is updated succesfully when answer data is changed-Aggregated", "isController": false}, {"data": [[1.0, 121.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_41-Verify that API reponse is negative for Missing category param", "isController": false}, {"data": [[1.0, 121.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_41-Verify that API reponse is negative for Missing category param-Aggregated", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_40-Verify that API reponse is negative for invalid category param", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_40-Verify that API reponse is negative for invalid category param-Aggregated", "isController": false}, {"data": [[1.0, 106.0]], "isOverall": false, "label": "Download file ", "isController": false}, {"data": [[1.0, 106.0]], "isOverall": false, "label": "Download file -Aggregated", "isController": false}, {"data": [[1.0, 217.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_31-Verify fetch all feedback by missing pageNum and pageSize parameter", "isController": false}, {"data": [[1.0, 217.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_31-Verify fetch all feedback by missing pageNum and pageSize parameter-Aggregated", "isController": false}, {"data": [[1.0, 408.0]], "isOverall": false, "label": "Create fb-TC_AM_A_06-Verify feedback creation with missing rating field", "isController": false}, {"data": [[1.0, 408.0]], "isOverall": false, "label": "Create fb-TC_AM_A_06-Verify feedback creation with missing rating field-Aggregated", "isController": false}, {"data": [[1.0, 168.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_88-Verify update tickets by ID with unregister ticket ID ", "isController": false}, {"data": [[1.0, 168.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_88-Verify update tickets by ID with unregister ticket ID -Aggregated", "isController": false}, {"data": [[1.0, 140.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_39-Verify that API response is negative if category field is missing", "isController": false}, {"data": [[1.0, 140.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_39-Verify that API response is negative if category field is missing-Aggregated", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Download file-TC_AM_A_47-Verify download file response with all valid input", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Download file-TC_AM_A_47-Verify download file response with all valid input-Aggregated", "isController": false}, {"data": [[1.0, 146.0]], "isOverall": false, "label": "Get_faq", "isController": false}, {"data": [[1.0, 146.0]], "isOverall": false, "label": "Get_faq-Aggregated", "isController": false}, {"data": [[1.0, 213.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_118-Verify upload privacy policies file response by sending unregister X-TANANTID in request header", "isController": false}, {"data": [[1.0, 213.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_118-Verify upload privacy policies file response by sending unregister X-TANANTID in request header-Aggregated", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_90-Verify update tickets by ID when Content-type key value is invalid in request payload ", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_90-Verify update tickets by ID when Content-type key value is invalid in request payload -Aggregated", "isController": false}, {"data": [[1.0, 564.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_107-Verify upload log response when X-TANENTID field is missing in request header", "isController": false}, {"data": [[1.0, 564.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_107-Verify upload log response when X-TANENTID field is missing in request header-Aggregated", "isController": false}, {"data": [[1.0, 123.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_47-Verify that api response is according to req. \nwith missing tenant header", "isController": false}, {"data": [[1.0, 123.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_47-Verify that api response is according to req. \nwith missing tenant header-Aggregated", "isController": false}, {"data": [[1.0, 121.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_103-Verify get all ticket with minimum page number and page size in request param (Ex: 1,1)", "isController": false}, {"data": [[1.0, 121.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_103-Verify get all ticket with minimum page number and page size in request param (Ex: 1,1)-Aggregated", "isController": false}, {"data": [[1.0, 123.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_63-Verify create tickets by sending unregister X-TENANTID", "isController": false}, {"data": [[1.0, 123.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_63-Verify create tickets by sending unregister X-TENANTID-Aggregated", "isController": false}, {"data": [[1.0, 206.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_53-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[1.0, 206.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_53-Verify that api is not executed successfully , when inavild accept type is present-Aggregated", "isController": false}, {"data": [[1.0, 142.75]], "isOverall": false, "label": "Download policies-TC_AM_A_125-Verify download privacy policies file with invalid file name ", "isController": false}, {"data": [[1.0, 142.75]], "isOverall": false, "label": "Download policies-TC_AM_A_125-Verify download privacy policies file with invalid file name -Aggregated", "isController": false}, {"data": [[1.0, 146.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_86-Verify update tickets by ID when X-TENANTID field is missing", "isController": false}, {"data": [[1.0, 146.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_86-Verify update tickets by ID when X-TENANTID field is missing-Aggregated", "isController": false}, {"data": [[1.0, 191.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_52-Verify that API response is Successful if all headers and payload is accurate and as per req.", "isController": false}, {"data": [[1.0, 191.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_52-Verify that API response is Successful if all headers and payload is accurate and as per req.-Aggregated", "isController": false}, {"data": [[1.0, 208.25]], "isOverall": false, "label": "Create_Faqs", "isController": false}, {"data": [[1.0, 208.25]], "isOverall": false, "label": "Create_Faqs-Aggregated", "isController": false}, {"data": [[1.0, 180.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_57-Verify that API reponse is negative for Missing category param", "isController": false}, {"data": [[1.0, 180.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_57-Verify that API reponse is negative for Missing category param-Aggregated", "isController": false}, {"data": [[1.0, 364.0]], "isOverall": false, "label": "Create fb-TC_AM_A_04-Verify feedback creation with missing content field", "isController": false}, {"data": [[1.0, 364.0]], "isOverall": false, "label": "Create fb-TC_AM_A_04-Verify feedback creation with missing content field-Aggregated", "isController": false}, {"data": [[1.0, 176.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_30-Verify that faq order field does not take any other input than integer", "isController": false}, {"data": [[1.0, 176.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_30-Verify that faq order field does not take any other input than integer-Aggregated", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_79-Verify update ticket by ID when \"status\" field is null in request payload ", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_79-Verify update ticket by ID when \"status\" field is null in request payload -Aggregated", "isController": false}, {"data": [[1.0, 168.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_91-Verify delete tickets by ID with all valid input", "isController": false}, {"data": [[1.0, 168.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_91-Verify delete tickets by ID with all valid input-Aggregated", "isController": false}, {"data": [[1.0, 408.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_97-Verify get all ticket with all valid input ", "isController": false}, {"data": [[1.0, 408.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_97-Verify get all ticket with all valid input -Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_96-Verify delete tickets by ID when accept key value is invalid in request headers ", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_96-Verify delete tickets by ID when accept key value is invalid in request headers -Aggregated", "isController": false}, {"data": [[1.0, 0.0]], "isOverall": false, "label": "Upload file-TC_AM_A_45-Verify upload file response by sending blank file in request payload ", "isController": false}, {"data": [[1.0, 0.0]], "isOverall": false, "label": "Upload file-TC_AM_A_45-Verify upload file response by sending blank file in request payload -Aggregated", "isController": false}, {"data": [[1.0, 166.11111111111111]], "isOverall": false, "label": "Get_ticket", "isController": false}, {"data": [[1.0, 166.11111111111111]], "isOverall": false, "label": "Get_ticket-Aggregated", "isController": false}, {"data": [[1.0, 286.0]], "isOverall": false, "label": "Create fb-TC_AM_A_11-Verify feedback creation when rating field value is null ", "isController": false}, {"data": [[1.0, 286.0]], "isOverall": false, "label": "Create fb-TC_AM_A_11-Verify feedback creation when rating field value is null -Aggregated", "isController": false}, {"data": [[1.0, 176.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_43-Verify that API reponse is negative for Missing faq path var", "isController": false}, {"data": [[1.0, 176.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_43-Verify that API reponse is negative for Missing faq path var-Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_42-Verify that API reponse is negative for faq param not in db", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_42-Verify that API reponse is negative for faq param not in db-Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_56-Verify create ticket when \"description\" field is missing from request payload ", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_56-Verify create ticket when \"description\" field is missing from request payload -Aggregated", "isController": false}, {"data": [[1.0, 191.0]], "isOverall": false, "label": "Download file-TC_AM_A_49-Verify download file response with invalid file name ", "isController": false}, {"data": [[1.0, 191.0]], "isOverall": false, "label": "Download file-TC_AM_A_49-Verify download file response with invalid file name -Aggregated", "isController": false}, {"data": [[1.0, 1039.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_103-Verify upload logs with all valid inputs ", "isController": false}, {"data": [[1.0, 1039.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_103-Verify upload logs with all valid inputs -Aggregated", "isController": false}, {"data": [[1.0, 177.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_59-Verify create ticket by sending empty payload ", "isController": false}, {"data": [[1.0, 177.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_59-Verify create ticket by sending empty payload -Aggregated", "isController": false}, {"data": [[1.0, 158.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_45-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[1.0, 158.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_45-Verify that api is not executed successfully , when inavild accept type is present-Aggregated", "isController": false}, {"data": [[1.0, 178.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_93-Verify delete tickets by ID with unregister ticket ID ", "isController": false}, {"data": [[1.0, 178.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_93-Verify delete tickets by ID with unregister ticket ID -Aggregated", "isController": false}, {"data": [[1.0, 198.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_24-Verify get feedback by ID with non-register ID ", "isController": false}, {"data": [[1.0, 198.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_24-Verify get feedback by ID with non-register ID -Aggregated", "isController": false}, {"data": [[1.0, 211.0]], "isOverall": false, "label": "Delete_faq", "isController": false}, {"data": [[1.0, 211.0]], "isOverall": false, "label": "Delete_faq-Aggregated", "isController": false}, {"data": [[1.0, 228.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_25-Verify that FAQ is updated succesfully when category data is changed", "isController": false}, {"data": [[1.0, 228.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_25-Verify that FAQ is updated succesfully when category data is changed-Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_28-Verify that api response is according to req. after passing unregistered\ntenant name as header", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_28-Verify that api response is according to req. after passing unregistered\ntenant name as header-Aggregated", "isController": false}, {"data": [[1.0, 190.0]], "isOverall": false, "label": "Get_Faq", "isController": false}, {"data": [[1.0, 190.0]], "isOverall": false, "label": "Get_Faq-Aggregated", "isController": false}, {"data": [[1.0, 167.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_58-Verify that API reponse is negative for faq param that is not in db", "isController": false}, {"data": [[1.0, 167.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_58-Verify that API reponse is negative for faq param that is not in db-Aggregated", "isController": false}, {"data": [[1.0, 142.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_17-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[1.0, 142.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_17-Verify that api is not executed successfully , when inavild accept type is present-Aggregated", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Download policies-TC_AM_A_124-Verify download privacy policies file with all valid input", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Download policies-TC_AM_A_124-Verify download privacy policies file with all valid input-Aggregated", "isController": false}, {"data": [[1.0, 118.0]], "isOverall": false, "label": "Download policies-TC_AM_A_128-Verify download privacy policies file with missing X-TANANTID in request header", "isController": false}, {"data": [[1.0, 118.0]], "isOverall": false, "label": "Download policies-TC_AM_A_128-Verify download privacy policies file with missing X-TANANTID in request header-Aggregated", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_11-Verify that API response is negative if category field is set to null", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_11-Verify that API response is negative if category field is set to null-Aggregated", "isController": false}, {"data": [[1.0, 199.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_81-Verify update ticket by ID when subject field is integer in request body ", "isController": false}, {"data": [[1.0, 199.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_81-Verify update ticket by ID when subject field is integer in request body -Aggregated", "isController": false}, {"data": [[1.0, 356.0]], "isOverall": false, "label": "Create fb-TC_AM_A_03-Verify feedback creation with missing subject field", "isController": false}, {"data": [[1.0, 356.0]], "isOverall": false, "label": "Create fb-TC_AM_A_03-Verify feedback creation with missing subject field-Aggregated", "isController": false}, {"data": [[1.0, 261.0]], "isOverall": false, "label": "Create fb-TC_AM_A_02-Verify feedback creation by passing empty payload ", "isController": false}, {"data": [[1.0, 261.0]], "isOverall": false, "label": "Create fb-TC_AM_A_02-Verify feedback creation by passing empty payload -Aggregated", "isController": false}, {"data": [[1.0, 129.0]], "isOverall": false, "label": "Download file-TC_AM_A_52-Verify download file response content with uploaded file content ", "isController": false}, {"data": [[1.0, 129.0]], "isOverall": false, "label": "Download file-TC_AM_A_52-Verify download file response content with uploaded file content -Aggregated", "isController": false}, {"data": [[1.0, 117.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_95-Verify delete tickets by ID when tenant ID field is missing in request header ", "isController": false}, {"data": [[1.0, 117.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_95-Verify delete tickets by ID when tenant ID field is missing in request header -Aggregated", "isController": false}, {"data": [[1.0, 187.0]], "isOverall": false, "label": "Delete Faq", "isController": false}, {"data": [[1.0, 187.0]], "isOverall": false, "label": "Delete Faq-Aggregated", "isController": false}, {"data": [[1.0, 219.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_26-Verify that api is not executed successfully , when inavild accept type is present", "isController": false}, {"data": [[1.0, 219.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_26-Verify that api is not executed successfully , when inavild accept type is present-Aggregated", "isController": false}, {"data": [[1.0, 130.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_68-Verify get ticket by ID with invalid ticket ID ", "isController": false}, {"data": [[1.0, 130.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_68-Verify get ticket by ID with invalid ticket ID -Aggregated", "isController": false}, {"data": [[1.0, 108.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_121-Verify upload privacy policies file response by sending other than .html file in payload ", "isController": false}, {"data": [[1.0, 108.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_121-Verify upload privacy policies file response by sending other than .html file in payload -Aggregated", "isController": false}, {"data": [[1.0, 178.2]], "isOverall": false, "label": "Delete feedback", "isController": false}, {"data": [[1.0, 178.2]], "isOverall": false, "label": "Delete feedback-Aggregated", "isController": false}, {"data": [[1.0, 201.0]], "isOverall": false, "label": "Download file-TC_AM_A_50-Verify download file response with unregister X-TANANTID in request header", "isController": false}, {"data": [[1.0, 201.0]], "isOverall": false, "label": "Download file-TC_AM_A_50-Verify download file response with unregister X-TANANTID in request header-Aggregated", "isController": false}, {"data": [[1.0, 146.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_29-Verify get all feedback by passing non-register X-TANANTID ", "isController": false}, {"data": [[1.0, 146.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_29-Verify get all feedback by passing non-register X-TANANTID -Aggregated", "isController": false}, {"data": [[1.0, 235.0]], "isOverall": false, "label": "Create fb-TC_AM_A_14-Verify feedback creation by passing integer value in content field", "isController": false}, {"data": [[1.0, 235.0]], "isOverall": false, "label": "Create fb-TC_AM_A_14-Verify feedback creation by passing integer value in content field-Aggregated", "isController": false}, {"data": [[1.0, 185.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_76-Verify update ticket by ID when \"Status\" field is missing from request payload ", "isController": false}, {"data": [[1.0, 185.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_76-Verify update ticket by ID when \"Status\" field is missing from request payload -Aggregated", "isController": false}, {"data": [[1.0, 210.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_77-Verify update ticket by ID when \"subject\" field is null in request payload ", "isController": false}, {"data": [[1.0, 210.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_77-Verify update ticket by ID when \"subject\" field is null in request payload -Aggregated", "isController": false}, {"data": [[1.0, 403.0]], "isOverall": false, "label": "Download logs-TC_AM_A_112-Verify download log response with all valid input", "isController": false}, {"data": [[1.0, 403.0]], "isOverall": false, "label": "Download logs-TC_AM_A_112-Verify download log response with all valid input-Aggregated", "isController": false}, {"data": [[1.0, 116.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_118-Verify upload privacy policies file response by sending other than .html file in payload ", "isController": false}, {"data": [[1.0, 116.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_118-Verify upload privacy policies file response by sending other than .html file in payload -Aggregated", "isController": false}, {"data": [[1.0, 150.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_31-Verify that Category field does not accept any other input that mobile / web", "isController": false}, {"data": [[1.0, 150.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_31-Verify that Category field does not accept any other input that mobile / web-Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_65-Verify create tickets when accept key value is invalid in request headers", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_65-Verify create tickets when accept key value is invalid in request headers-Aggregated", "isController": false}, {"data": [[1.0, 135.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_36-Verify delete feedback when X-TENANTID value is null in request header", "isController": false}, {"data": [[1.0, 135.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_36-Verify delete feedback when X-TENANTID value is null in request header-Aggregated", "isController": false}, {"data": [[1.0, 187.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_20-Verify that API reponse is negative for invalid category param", "isController": false}, {"data": [[1.0, 187.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_20-Verify that API reponse is negative for invalid category param-Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_32-Verify fetch all feedback when accept is invalid in request header", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_32-Verify fetch all feedback when accept is invalid in request header-Aggregated", "isController": false}, {"data": [[1.0, 109.0]], "isOverall": false, "label": "Download logs-TC_AM_A_115-Verify download log response with unregister X-TANENTID in request header", "isController": false}, {"data": [[1.0, 109.0]], "isOverall": false, "label": "Download logs-TC_AM_A_115-Verify download log response with unregister X-TANENTID in request header-Aggregated", "isController": false}, {"data": [[1.0, 136.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_83-Verify update ticket by ID status field will not accept other than ON_HOLD, IN_PROGRESS, CLOSED, OPEN values ", "isController": false}, {"data": [[1.0, 136.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_83-Verify update ticket by ID status field will not accept other than ON_HOLD, IN_PROGRESS, CLOSED, OPEN values -Aggregated", "isController": false}, {"data": [[1.0, 285.0]], "isOverall": false, "label": "Create fb-TC_AM_A_12-Verify feedback creation by passing duplicate field value and verify response ID ", "isController": false}, {"data": [[1.0, 285.0]], "isOverall": false, "label": "Create fb-TC_AM_A_12-Verify feedback creation by passing duplicate field value and verify response ID -Aggregated", "isController": false}, {"data": [[1.0, 232.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_34-Verify that API response is negative if faq order field is set to null", "isController": false}, {"data": [[1.0, 232.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_34-Verify that API response is negative if faq order field is set to null-Aggregated", "isController": false}, {"data": [[1.0, 203.83333333333337]], "isOverall": false, "label": "Create_faq", "isController": false}, {"data": [[1.0, 203.83333333333337]], "isOverall": false, "label": "Create_faq-Aggregated", "isController": false}, {"data": [[1.0, 146.4]], "isOverall": false, "label": "Get_Faq_by_ID", "isController": false}, {"data": [[1.0, 146.4]], "isOverall": false, "label": "Get_Faq_by_ID-Aggregated", "isController": false}, {"data": [[1.0, 121.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_62-Verify create tickets by sending additional field in request payload ", "isController": false}, {"data": [[1.0, 121.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_62-Verify create tickets by sending additional field in request payload -Aggregated", "isController": false}, {"data": [[1.0, 260.0]], "isOverall": false, "label": "Create fb-TC_AM_A_09-Verify feedback creation when content field value is null ", "isController": false}, {"data": [[1.0, 260.0]], "isOverall": false, "label": "Create fb-TC_AM_A_09-Verify feedback creation when content field value is null -Aggregated", "isController": false}, {"data": [[1.0, 135.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_48-Verify that API reponse is negative for invalid category param", "isController": false}, {"data": [[1.0, 135.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_48-Verify that API reponse is negative for invalid category param-Aggregated", "isController": false}, {"data": [[1.0, 136.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_44-Verify that API response is Successful if all headers and payload is accurate and as per req.", "isController": false}, {"data": [[1.0, 136.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_44-Verify that API response is Successful if all headers and payload is accurate and as per req.-Aggregated", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_12-Verify that API response is negative if question field is missing", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_12-Verify that API response is negative if question field is missing-Aggregated", "isController": false}, {"data": [[1.0, 128.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_32-Verify that API response is negative if question field is set to null", "isController": false}, {"data": [[1.0, 128.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_32-Verify that API response is negative if question field is set to null-Aggregated", "isController": false}, {"data": [[1.0, 166.5]], "isOverall": false, "label": "Get_Feedback", "isController": false}, {"data": [[1.0, 166.5]], "isOverall": false, "label": "Get_Feedback-Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_55-Verify create ticket when \"subject\" field is missing from request payload ", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_55-Verify create ticket when \"subject\" field is missing from request payload -Aggregated", "isController": false}, {"data": [[1.0, 142.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_104-Verify upload log response by sending other than .log file in payload ", "isController": false}, {"data": [[1.0, 142.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_104-Verify upload log response by sending other than .log file in payload -Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_23-Verify that FAQ is updated succesfully when question data is changed", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_23-Verify that FAQ is updated succesfully when question data is changed-Aggregated", "isController": false}, {"data": [[1.0, 624.5]], "isOverall": false, "label": "Upload logs", "isController": false}, {"data": [[1.0, 624.5]], "isOverall": false, "label": "Upload logs-Aggregated", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_10-Verify that API response is negative if faq order field is set to null", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_10-Verify that API response is negative if faq order field is set to null-Aggregated", "isController": false}, {"data": [[1.0, 149.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_120-Verify upload privacy policies file response when invalid accept header in request header", "isController": false}, {"data": [[1.0, 149.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_120-Verify upload privacy policies file response when invalid accept header in request header-Aggregated", "isController": false}, {"data": [[1.0, 182.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_74-Verify update ticket by ID when \"subject\" field is missing from request payload ", "isController": false}, {"data": [[1.0, 182.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_74-Verify update ticket by ID when \"subject\" field is missing from request payload -Aggregated", "isController": false}, {"data": [[1.0, 300.0]], "isOverall": false, "label": "Create fb-TC_AM_A_16-Verify feedback creation by passing unregister userID value in userId field", "isController": false}, {"data": [[1.0, 300.0]], "isOverall": false, "label": "Create fb-TC_AM_A_16-Verify feedback creation by passing unregister userID value in userId field-Aggregated", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_80-Verify update ticket by ID when request payload is empty", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_80-Verify update ticket by ID when request payload is empty-Aggregated", "isController": false}, {"data": [[1.0, 139.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_84-Verify update ticket by ID by sending additional field in request payload ", "isController": false}, {"data": [[1.0, 139.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_84-Verify update ticket by ID by sending additional field in request payload -Aggregated", "isController": false}, {"data": [[1.0, 720.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_13-Verify that API response is negative if answer field is missing", "isController": false}, {"data": [[1.0, 720.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_13-Verify that API response is negative if answer field is missing-Aggregated", "isController": false}, {"data": [[1.0, 219.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_117-Verify upload privacy policies file response with all valid input", "isController": false}, {"data": [[1.0, 219.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_117-Verify upload privacy policies file response with all valid input-Aggregated", "isController": false}, {"data": [[1.0, 123.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_70-Verify get ticket by ID with null tenantID value", "isController": false}, {"data": [[1.0, 123.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_70-Verify get ticket by ID with null tenantID value-Aggregated", "isController": false}, {"data": [[1.0, 403.0]], "isOverall": false, "label": "Create fb-TC_AM_A_05-Verify feedback creation with missing userID field", "isController": false}, {"data": [[1.0, 403.0]], "isOverall": false, "label": "Create fb-TC_AM_A_05-Verify feedback creation with missing userID field-Aggregated", "isController": false}, {"data": [[1.0, 197.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_22-Verify get feedback by ID with all valid input \n", "isController": false}, {"data": [[1.0, 197.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_22-Verify get feedback by ID with all valid input \n-Aggregated", "isController": false}, {"data": [[1.0, 119.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_58-Verify create ticket when \"description\" field is null in request payload ", "isController": false}, {"data": [[1.0, 119.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_58-Verify create ticket when \"description\" field is null in request payload -Aggregated", "isController": false}, {"data": [[1.0, 196.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_64-Verify create tickets by using registered field value\n(Ticket ID will generate unique for duplicate field value )", "isController": false}, {"data": [[1.0, 196.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_64-Verify create tickets by using registered field value\n(Ticket ID will generate unique for duplicate field value )-Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_94-Verify delete tickets by ID with unregister tenant ID ", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Delete_ticket-TC_AM_A_94-Verify delete tickets by ID with unregister tenant ID -Aggregated", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_38-Verify that API response is negative if faq order field is missing", "isController": false}, {"data": [[1.0, 204.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_38-Verify that API response is negative if faq order field is missing-Aggregated", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_73-Verify update ticket by ID with all valid input ", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_73-Verify update ticket by ID with all valid input -Aggregated", "isController": false}, {"data": [[1.0, 309.66666666666663]], "isOverall": false, "label": "Create fb", "isController": false}, {"data": [[1.0, 309.66666666666663]], "isOverall": false, "label": "Create fb-Aggregated", "isController": false}, {"data": [[1.0, 303.0]], "isOverall": false, "label": "Create fb-TC_AM_A_01-To verify feedback creation with all valid inputs", "isController": false}, {"data": [[1.0, 303.0]], "isOverall": false, "label": "Create fb-TC_AM_A_01-To verify feedback creation with all valid inputs-Aggregated", "isController": false}, {"data": [[1.0, 220.0]], "isOverall": false, "label": "Download privacy policies", "isController": false}, {"data": [[1.0, 220.0]], "isOverall": false, "label": "Download privacy policies-Aggregated", "isController": false}, {"data": [[1.0, 218.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_35-Verify delete feedback with non-register ID ", "isController": false}, {"data": [[1.0, 218.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_35-Verify delete feedback with non-register ID -Aggregated", "isController": false}, {"data": [[1.0, 260.0]], "isOverall": false, "label": "Create fb-TC_AM_A_18-Verify feedback creation null X-TENANTID in request header", "isController": false}, {"data": [[1.0, 260.0]], "isOverall": false, "label": "Create fb-TC_AM_A_18-Verify feedback creation null X-TENANTID in request header-Aggregated", "isController": false}, {"data": [[1.0, 133.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_61-Verify create tickets by sending integer value in request \"description\" field", "isController": false}, {"data": [[1.0, 133.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_61-Verify create tickets by sending integer value in request \"description\" field-Aggregated", "isController": false}, {"data": [[1.0, 118.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_33-Verify that API response is negative if answer field is set to null", "isController": false}, {"data": [[1.0, 118.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_33-Verify that API response is negative if answer field is set to null-Aggregated", "isController": false}, {"data": [[1.0, 406.0]], "isOverall": false, "label": "Create fb-TC_AM_A_17-Verify feedback creation rating field accept only integer (0-5) value ", "isController": false}, {"data": [[1.0, 406.0]], "isOverall": false, "label": "Create fb-TC_AM_A_17-Verify feedback creation rating field accept only integer (0-5) value -Aggregated", "isController": false}, {"data": [[1.0, 199.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_4-Verify that api response is according to req. after passing unregistered tenant name as header", "isController": false}, {"data": [[1.0, 199.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_4-Verify that api response is according to req. after passing unregistered tenant name as header-Aggregated", "isController": false}, {"data": [[1.0, 120.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_67-Verify get ticket by ID with all valid input ", "isController": false}, {"data": [[1.0, 120.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_67-Verify get ticket by ID with all valid input -Aggregated", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_23-Verify get feedback by ID with invalid ID ", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_23-Verify get feedback by ID with invalid ID -Aggregated", "isController": false}, {"data": [[1.0, 199.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_57-Verify create ticket when \"subject\" field is null in request payload ", "isController": false}, {"data": [[1.0, 199.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_57-Verify create ticket when \"subject\" field is null in request payload -Aggregated", "isController": false}, {"data": [[1.0, 133.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_82-Verify update ticket by ID when \"description\" field is integer in request body", "isController": false}, {"data": [[1.0, 133.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_82-Verify update ticket by ID when \"description\" field is integer in request body-Aggregated", "isController": false}, {"data": [[1.0, 199.87500000000003]], "isOverall": false, "label": "Upload file", "isController": false}, {"data": [[1.0, 199.87500000000003]], "isOverall": false, "label": "Upload file-Aggregated", "isController": false}, {"data": [[1.0, 218.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_51-Verify that API reponse is negative for invalid faq path varibale", "isController": false}, {"data": [[1.0, 218.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_51-Verify that API reponse is negative for invalid faq path varibale-Aggregated", "isController": false}, {"data": [[1.0, 198.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_66-Verify create tickets when content-type key value is invalid in request headers", "isController": false}, {"data": [[1.0, 198.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_66-Verify create tickets when content-type key value is invalid in request headers-Aggregated", "isController": false}, {"data": [[1.0, 120.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_18-Verify that api response is according to req. after passing unregistered\ntenant name as header", "isController": false}, {"data": [[1.0, 120.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_18-Verify that api response is according to req. after passing unregistered\ntenant name as header-Aggregated", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_27-Verify that api is not executed successfully , when invalid/wrong\ncontent type header is there OR content header not present", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_27-Verify that api is not executed successfully , when invalid/wrong\ncontent type header is there OR content header not present-Aggregated", "isController": false}, {"data": [[1.0, 216.125]], "isOverall": false, "label": "Delete_ticket", "isController": false}, {"data": [[1.0, 216.125]], "isOverall": false, "label": "Delete_ticket-Aggregated", "isController": false}, {"data": [[1.0, 136.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_26-Verify get feedback by ID when X-TANANTID field is not present in request header ", "isController": false}, {"data": [[1.0, 136.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_26-Verify get feedback by ID when X-TANANTID field is not present in request header -Aggregated", "isController": false}, {"data": [[1.0, 124.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_49-Verify that API reponse is negative for Missing category param", "isController": false}, {"data": [[1.0, 124.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_49-Verify that API reponse is negative for Missing category param-Aggregated", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_21-Verify that API reponse is negative for Missing category param", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_21-Verify that API reponse is negative for Missing category param-Aggregated", "isController": false}, {"data": [[1.0, 142.0]], "isOverall": false, "label": "Download file-TC_AM_A_48-Verify that requested file exist by inspecting the response body and headers ", "isController": false}, {"data": [[1.0, 142.0]], "isOverall": false, "label": "Download file-TC_AM_A_48-Verify that requested file exist by inspecting the response body and headers -Aggregated", "isController": false}, {"data": [[1.0, 135.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_36-Verify that API response is negative if question field is missing", "isController": false}, {"data": [[1.0, 135.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_36-Verify that API response is negative if question field is missing-Aggregated", "isController": false}, {"data": [[1.0, 110.0]], "isOverall": false, "label": "Upload file-TC_AM_A_46-Verify upload file response by sending unregister X-TANANTID in request header", "isController": false}, {"data": [[1.0, 110.0]], "isOverall": false, "label": "Upload file-TC_AM_A_46-Verify upload file response by sending unregister X-TANANTID in request header-Aggregated", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_101-Verify get all ticket with invalid page number in request param (Use non-numeric value ex: abc, negative number ex: -1,-2 etc )", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_101-Verify get all ticket with invalid page number in request param (Use non-numeric value ex: abc, negative number ex: -1,-2 etc )-Aggregated", "isController": false}, {"data": [[1.0, 237.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_50-Verify that API reponse is negative for unregistered faq id param", "isController": false}, {"data": [[1.0, 237.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_50-Verify that API reponse is negative for unregistered faq id param-Aggregated", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_54-Verify that api response is according to req. after passing unregistered\ntenant name as header", "isController": false}, {"data": [[1.0, 205.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_54-Verify that api response is according to req. after passing unregistered\ntenant name as header-Aggregated", "isController": false}, {"data": [[1.0, 126.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_99-Verify get all ticket with null tenantID value", "isController": false}, {"data": [[1.0, 126.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_99-Verify get all ticket with null tenantID value-Aggregated", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_5-Verify that api response is according to req. With missing tenant header", "isController": false}, {"data": [[1.0, 200.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_5-Verify that api response is according to req. With missing tenant header-Aggregated", "isController": false}, {"data": [[1.0, 227.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_22-Verify that FAQ is updated succesfully when faq order data is changed", "isController": false}, {"data": [[1.0, 227.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_22-Verify that FAQ is updated succesfully when faq order data is changed-Aggregated", "isController": false}, {"data": [[1.0, 342.0]], "isOverall": false, "label": "Upload file-TC_AM_A_43-Verify upload file response with all valid input", "isController": false}, {"data": [[1.0, 342.0]], "isOverall": false, "label": "Upload file-TC_AM_A_43-Verify upload file response with all valid input-Aggregated", "isController": false}, {"data": [[1.0, 247.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_71-Verify get ticket by ID with missing tenantID field", "isController": false}, {"data": [[1.0, 247.0]], "isOverall": false, "label": "Get_ticket-TC_AM_A_71-Verify get ticket by ID with missing tenantID field-Aggregated", "isController": false}, {"data": [[1.0, 130.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_29-Verify that api response is according to req. \nwith missing tenant header", "isController": false}, {"data": [[1.0, 130.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_29-Verify that api response is according to req. \nwith missing tenant header-Aggregated", "isController": false}, {"data": [[1.0, 265.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_28-Verify fetch all feedback with valid input", "isController": false}, {"data": [[1.0, 265.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_28-Verify fetch all feedback with valid input-Aggregated", "isController": false}, {"data": [[1.0, 157.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_120-Verify upload privacy policies file response by sending other than .html file in payload ", "isController": false}, {"data": [[1.0, 157.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_120-Verify upload privacy policies file response by sending other than .html file in payload -Aggregated", "isController": false}, {"data": [[1.0, 117.0]], "isOverall": false, "label": "Download policies-TC_AM_A_126-Verify download privacy policies file response with unregister X-TANANTID in request header", "isController": false}, {"data": [[1.0, 117.0]], "isOverall": false, "label": "Download policies-TC_AM_A_126-Verify download privacy policies file response with unregister X-TANANTID in request header-Aggregated", "isController": false}, {"data": [[1.0, 327.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_1-Verify that API response is Successful if all headers and payload is accurate and as per req. ", "isController": false}, {"data": [[1.0, 327.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_1-Verify that API response is Successful if all headers and payload is accurate and as per req. -Aggregated", "isController": false}, {"data": [[1.0, 125.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_37-Verify that API response is negative if answer field is missing", "isController": false}, {"data": [[1.0, 125.0]], "isOverall": false, "label": "Update_faq_by_ID-TC_AM_B_37-Verify that API response is negative if answer field is missing-Aggregated", "isController": false}, {"data": [[1.0, 115.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_46-Verify that api response is according to req. after passing unregistered\ntenant name as header", "isController": false}, {"data": [[1.0, 115.0]], "isOverall": false, "label": "Get_Faq_by_ID- TC_AM_B_46-Verify that api response is according to req. after passing unregistered\ntenant name as header-Aggregated", "isController": false}, {"data": [[1.0, 198.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_6-Verify that faq order field does not take any other input than integer", "isController": false}, {"data": [[1.0, 198.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_6-Verify that faq order field does not take any other input than integer-Aggregated", "isController": false}, {"data": [[1.0, 201.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_34-Verify delete feedback with invalid ID ", "isController": false}, {"data": [[1.0, 201.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_34-Verify delete feedback with invalid ID -Aggregated", "isController": false}, {"data": [[1.0, 141.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_30-Verify fetch all feedback by passing invalid pageNum and pageSize in request param", "isController": false}, {"data": [[1.0, 141.0]], "isOverall": false, "label": "Get_all_fb-TC_AM_A_30-Verify fetch all feedback by passing invalid pageNum and pageSize in request param-Aggregated", "isController": false}, {"data": [[1.0, 161.75]], "isOverall": false, "label": "Get feedback", "isController": false}, {"data": [[1.0, 161.75]], "isOverall": false, "label": "Get feedback-Aggregated", "isController": false}, {"data": [[1.0, 321.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_16-Verify that API response is Successful if all headers and payload is accurate and as per requirement", "isController": false}, {"data": [[1.0, 321.0]], "isOverall": false, "label": "Get_all_Faqs-TC_AM_B_16-Verify that API response is Successful if all headers and payload is accurate and as per requirement-Aggregated", "isController": false}, {"data": [[1.0, 229.0]], "isOverall": false, "label": "Download file-TC_AM_A_53-Verify download file response with missing X-TANANTID in request header", "isController": false}, {"data": [[1.0, 229.0]], "isOverall": false, "label": "Download file-TC_AM_A_53-Verify download file response with missing X-TANANTID in request header-Aggregated", "isController": false}, {"data": [[1.0, 249.0]], "isOverall": false, "label": "Create fb-TC_AM_A_19-Verify feedback creation with unregister X-TENANTID ", "isController": false}, {"data": [[1.0, 249.0]], "isOverall": false, "label": "Create fb-TC_AM_A_19-Verify feedback creation with unregister X-TENANTID -Aggregated", "isController": false}, {"data": [[1.0, 116.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_14-Verify that API response is negative if faq order field is missing", "isController": false}, {"data": [[1.0, 116.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_14-Verify that API response is negative if faq order field is missing-Aggregated", "isController": false}, {"data": [[1.0, 137.0]], "isOverall": false, "label": "Download file-TC_AM_A_51-Verify download file response with invalid file name ", "isController": false}, {"data": [[1.0, 137.0]], "isOverall": false, "label": "Download file-TC_AM_A_51-Verify download file response with invalid file name -Aggregated", "isController": false}, {"data": [[1.0, 201.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_119-Verify upload privacy policies file response when X-TANANTID field is not present in request header", "isController": false}, {"data": [[1.0, 201.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_119-Verify upload privacy policies file response when X-TANANTID field is not present in request header-Aggregated", "isController": false}, {"data": [[1.0, 115.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_55-Verify that api response is according to req. \nwith missing tenant header", "isController": false}, {"data": [[1.0, 115.0]], "isOverall": false, "label": "Delete_Faq_by_Id-TC_AM_B_55-Verify that api response is according to req. \nwith missing tenant header-Aggregated", "isController": false}, {"data": [[1.0, 230.96666666666667]], "isOverall": false, "label": "Create_tickets", "isController": false}, {"data": [[1.0, 230.96666666666667]], "isOverall": false, "label": "Create_tickets-Aggregated", "isController": false}, {"data": [[1.0, 175.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_15-Verify that API response is negative if category field is missing", "isController": false}, {"data": [[1.0, 175.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_15-Verify that API response is negative if category field is missing-Aggregated", "isController": false}, {"data": [[1.0, 164.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_89-Verify update tickets by ID when accept key value is invalid in request payload ", "isController": false}, {"data": [[1.0, 164.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_89-Verify update tickets by ID when accept key value is invalid in request payload -Aggregated", "isController": false}, {"data": [[1.0, 201.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_7-Verify that Category field does not accept any other input than mobile / web", "isController": false}, {"data": [[1.0, 201.0]], "isOverall": false, "label": "Create_Faqs-TC_AM_B_7-Verify that Category field does not accept any other input than mobile / web-Aggregated", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_78-Verify update ticket by ID when \"description\" field is null in request payload ", "isController": false}, {"data": [[1.0, 203.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_78-Verify update ticket by ID when \"description\" field is null in request payload -Aggregated", "isController": false}, {"data": [[1.0, 189.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_37-Verify delete feedback with already deleted ID ", "isController": false}, {"data": [[1.0, 189.0]], "isOverall": false, "label": "Delete feedback-TC_AM_A_37-Verify delete feedback with already deleted ID -Aggregated", "isController": false}, {"data": [[1.0, 128.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_25-Verify get feedback by ID when X-TANANTID value is missing in request header ", "isController": false}, {"data": [[1.0, 128.0]], "isOverall": false, "label": "Get feedback-TC_AM_A_25-Verify get feedback by ID when X-TANANTID value is missing in request header -Aggregated", "isController": false}, {"data": [[1.0, 130.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_60-Verify create tickets by sending integer value in request subject field", "isController": false}, {"data": [[1.0, 130.0]], "isOverall": false, "label": "Create_tickets-TC_AM_A_60-Verify create tickets by sending integer value in request subject field-Aggregated", "isController": false}, {"data": [[1.0, 104.0]], "isOverall": false, "label": "Download logs-TC_AM_A_114-Verify download log response with invalid file name ", "isController": false}, {"data": [[1.0, 104.0]], "isOverall": false, "label": "Download logs-TC_AM_A_114-Verify download log response with invalid file name -Aggregated", "isController": false}, {"data": [[1.0, 202.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_85-Verify update tickets by ID with unregister X-TENANTID ", "isController": false}, {"data": [[1.0, 202.0]], "isOverall": false, "label": "Update_ticket_by_ID-TC_AM_A_85-Verify update tickets by ID with unregister X-TENANTID -Aggregated", "isController": false}, {"data": [[1.0, 398.0]], "isOverall": false, "label": "Create fb-TC_AM_A_20-Verify feedback creation when Content-type is invalid in request header", "isController": false}, {"data": [[1.0, 398.0]], "isOverall": false, "label": "Create fb-TC_AM_A_20-Verify feedback creation when Content-type is invalid in request header-Aggregated", "isController": false}, {"data": [[1.0, 413.2]], "isOverall": false, "label": "Upload file-TC_AM_A_44-Verify upload file response by sending other than .html file in payload ", "isController": false}, {"data": [[1.0, 413.2]], "isOverall": false, "label": "Upload file-TC_AM_A_44-Verify upload file response by sending other than .html file in payload -Aggregated", "isController": false}, {"data": [[1.0, 105.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_119-Verify upload privacy policies file response by sending other than .html file in payload ", "isController": false}, {"data": [[1.0, 105.0]], "isOverall": false, "label": "Upload privacy policies-TC_AM_A_119-Verify upload privacy policies file response by sending other than .html file in payload -Aggregated", "isController": false}, {"data": [[1.0, 183.55555555555554]], "isOverall": false, "label": "Upload poilicies", "isController": false}, {"data": [[1.0, 183.55555555555554]], "isOverall": false, "label": "Upload poilicies-Aggregated", "isController": false}, {"data": [[1.0, 181.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_100-Verify get all ticket with missing tenantID field", "isController": false}, {"data": [[1.0, 181.0]], "isOverall": false, "label": "Get_all_tickets-TC_AM_A_100-Verify get all ticket with missing tenantID field-Aggregated", "isController": false}, {"data": [[1.0, 384.0]], "isOverall": false, "label": "Create fb-TC_AM_A_21-Verify feedback creation when accept is invalid request header", "isController": false}, {"data": [[1.0, 384.0]], "isOverall": false, "label": "Create fb-TC_AM_A_21-Verify feedback creation when accept is invalid request header-Aggregated", "isController": false}, {"data": [[1.0, 605.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_106-Verify upload log response by sending unregister X-TANENTID in request header", "isController": false}, {"data": [[1.0, 605.0]], "isOverall": false, "label": "Upload logs-TC_AM_A_106-Verify upload log response by sending unregister X-TANENTID in request header-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 1.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 369.3666666666667, "minX": 1.68836412E12, "maxY": 17613.366666666665, "series": [{"data": [[1.68836412E12, 471.0833333333333], [1.68836424E12, 7116.4], [1.68836418E12, 1480.95]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.68836412E12, 369.3666666666667], [1.68836424E12, 17613.366666666665], [1.68836418E12, 1130.2]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.68836424E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    }
    }else {
};