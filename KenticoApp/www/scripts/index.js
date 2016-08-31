"use strict";

var system_api_domain = "http://localhost:8080";

document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

function onDeviceReady() {

    console.log('Ready');
    // Handle the Cordova pause and resume events
    document.addEventListener( 'pause', onPause.bind( this ), false );
    document.addEventListener( 'resume', onResume.bind( this ), false );
        
    //// TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    $(document).ready(function () {
        //$('.user-profile-btn').text('click');
        $.get("systemPages.html", function (data) {
            $("body").append(data);

            $('#restartServerYes-btn').on('click', restartServerApiCall);
            $('.showEventlog-btn').on('click', showEventlogApiCall);
            $('#clearCacheYes-btn').on('click', clearCacheApiCall);
            $('#cleanUnusedMmryYes-btn').on('click', cleanUnusedMmryApiCall);

        });
        $.get("usrsPages.html", function (data) {
            $("body").append(data);

            $('#usrs-btn').on('click', getAllUsersApiCall);

        });
        $.get("authorizationPages.html", function (data) {
            $("body").append(data);
        });
        
        //instantiate all global popups from index.html
        $('#error-popup').enhanceWithin().popup();
        $('#text-popup').enhanceWithin().popup();
        $('#logout-popup').enhanceWithin().popup();
        $('#removeRole-popup').enhanceWithin().popup();
    });
};

function onPause() {
    // TODO: This application has been suspended. Save application state here.
};

function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
};