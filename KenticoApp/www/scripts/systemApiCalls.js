"use strict";

var system_api_url = system_api_domain + "/kenticoapi/system/";

function restartServerApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: system_api_url + "restart-server",
        type: 'POST',
        success: function onResponse(response) {
            console.log(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            $('#restartServer-popup').popup('close');
            hideCustomLoadingMessage();
        }
    });
}
        
function getGeneralInformationApiCall(success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: system_api_url + "show-general-information",
        type: 'GET',
        success: function (data) {
            if (success_callback) success_callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

function addListenerToGeneralInfoCollapsible() {
    $('#generalInformation-collapsible').bind('collapsibleexpand', function () {
        getGeneralInformationApiCall(function (data) {
            $('.serverName-h3').text(data.serverName);
            $('.serverURL-h3').text(data.serverURL);
            $('.serverLastModified-h3').text(data.serverLastModified);
            $('.serverLastStart-h3').text(data.serverLastStart);
            $('.virtualMemory-h3').text(data.virtualMemory);
            $('.peakWorkingSetSize-h3').text(data.workingPeak);
            $('.siteName-h3').text(data.siteName);
            $('.siteDomainName-h3').text(data.siteDomainName);
            $('.siteLastModified-h3').text(data.siteLastModified);
            $('.licenceValidTill-h3').text(data.licenseExpiration);
        });
    });

    //$('#generalInformation-collapsible').collapsible({
    //    expand: function () {
    //        getGeneralInformationApiCall(function (data) {
    //            $('.siteName-h3').text(data.siteName);
    //            $('.siteDisplayName-h3').text(data.siteDisplayName);
    //            $('.siteDomainName-h3').text(data.siteDomainName);
    //            $('.siteLastModified-h3').text(data.siteLastModified);
    //            $('.licenceValidTill-h3').text(data.licenseExpiration);
    //        });
    //    }
    //});
}

function showEventlogApiCall() {
    showCustomLoadingMessage();
    console.log(access_token);
    $.ajax({
        url: system_api_url + "show-eventlog",
        type: 'GET',
        success: function (response) {
            var $tablebody = $('#eventlog-table');
            $tablebody.empty();
            for (var i = 0; i < response.eventList.length; i++){
                var r = response.eventList[i];
                $tablebody.append(
                    '<tr>' +
                        '<td>' + r.EventID + '</td>' +
                        '<td>' + r.EventTime + '</td>' +
                        '<td>' + r.EventCode + '</td>' +
                        '<td>' + r.EventMachineName + '</td>' +
                        '<td>' + r.EventType + '</td>' +
                        (r.EventDescription.toString().length < 16 ?
                        '<td>' + r.EventDescription + '</td>' :
                        '<td><a id="eventDescription' + i + '-a">' + r.EventDescription.substring(0,15) + '...</a></td>') +
                    '</tr>');
                (function (row, index) {
                    $('#eventDescription' + index + '-a').on('click', function () {
                        showTextPopup(row.EventDescription);
                    });
                })(r, i);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

function clearCacheApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: system_api_url + "clear-cache",
        type: 'POST',
        success: function (response) {
            console.log(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            $('#clearCache-popup').popup('close');
            hideCustomLoadingMessage();
        }
    });
}

function cleanUnusedMmryApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: system_api_url + "clean-unused-memory",
        type: 'POST',
        success: function (response) {
            console.log(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            $('#cleanMemory-popup').popup('close');
            hideCustomLoadingMessage();
        }
    });
}
