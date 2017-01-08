"use strict";

//var system_api_domain = "http://localhost:8080";
var system_api_domain = "http://kenticocapi.azurewebsites.net";
var kentico_site_name = "CorporateSite";
var access_token = null;

document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );


function onDeviceReady() {

    $.ajaxSetup({
        beforeSend: function (xhr) {
            if (access_token !== null)
            {
                xhr.setRequestHeader("AccessToken", access_token);                
            }
        }
    });

    console.log('Ready');
    // Handle the Cordova pause and resume events
    document.addEventListener( 'pause', onPause.bind( this ), false );
    document.addEventListener( 'resume', onResume.bind( this ), false );
    //// TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    $(document).ready(function () {
        //adds listeners to buttons and pages

        addListenersToLoginForm();
        addListenersToLogoutBtn();

        $('#systemInfo-btn').on('click', function () {
            showTextPopup('To view general system information or event log, to restart the system and clean unused memory or cache memory.');
        });
        $('#usrsInfo-btn').on('click', function () {
            showTextPopup('To edit users');
        });
        $('#authorizationInfo-btn').on('click', function () {
            showTextPopup('To create and edit roles');
        });

        $.get("systemPages.html", function (data) {
            $("body").append(data);
            //$("#system-page").on("pageshow", General information);
            addListenerToGeneralInfoCollapsible();
            $('#restartServerYes-btn').on('click', restartServerApiCall);
            $('.showEventlog-btn').on('click', showEventlogApiCall);
            $('#clearCacheYes-btn').on('click', clearCacheApiCall);
            $('#cleanUnusedMmryYes-btn').on('click', cleanUnusedMmryApiCall);
        });

        $.get("usrsPages.html", function (data) {            
            $("body").append(data);   
            $("#users-page").on('pageshow', getAllUsersApiCall);            
            $('#userView-page').on('pageshow', viewCurrentUser);
        });

        $.get("authorizationPages.html", function (data) {
            $("body").append(data); 
            $("#authorization-page").on("pageshow", showAllRolesApiCall);
            $('#createNewRole-page').on('pageshow', createNewRole);
        });
        
        //instantiate all global popups from index.html
        $('#error-popup').enhanceWithin().popup();
        $('#text-popup').enhanceWithin().popup();
        $('#logout-popup').enhanceWithin().popup();
        $('#removeRole-popup').enhanceWithin().popup();
        $('#deleteRole-popup').enhanceWithin().popup();
        $('#removePermission-popup').enhanceWithin().popup();
    });
}

function onPause() {
    // TODO: This application has been suspended. Save application state here.
}

function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
}