﻿"use strict";

var system_api_domain = "http://localhost:8080";
var kentico_site_name = "CorporateSite";
var access_token = null;

document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );


function onDeviceReady() {

    $.ajaxSetup({
        beforeSend: function (xhr) {
            if(access_token != null) xhr.setRequestHeader("AccessToken", access_token);
        },
    });

    console.log('Ready');
    // Handle the Cordova pause and resume events
    document.addEventListener( 'pause', onPause.bind( this ), false );
    document.addEventListener( 'resume', onResume.bind( this ), false );
    //// TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    $(document).ready(function () {
        addListenersToLoginForm();
        addListenersToLogoutBtn();

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
            $('#createNewRole-page').on('pageshow', function () {
                createAllPermissionsCheckboxTable($('#allPermissionsCheckbox-table'), null, null, $('#createNewRole-btn'), function (selected) {
                    //create the role with to obtain it's Id
                    var newRoleDisplayName = $('#newRoleDisplayName-input').val();
                    var newRoleName = $('#newRoleName-input').val();
                    createNewRoleApiCall(newRoleName, newRoleDisplayName, function (data) {
                        //assign the selected Premissions
                        if (selected.length) {
                            assignPermissionsToRolesApiCall([data.newRoleId], selected, function () {
                                //Clear the form
                                $('#newRoleDisplayName-input').val('');
                                $('#newRoleName-input').val('');
                                $('#allPermissionsCheckbox-table input:checked').each(function () {
                                    $(this).prop('checked', false);
                                });
                                createRolePermissionsTable(data.newRoleId, $('#permissionsOfRole-table'), $('#roleName-h1'));
                            });
                        }          
                    });
                });
            });
        });
        
        //instantiate all global popups from index.html
        $('#error-popup').enhanceWithin().popup();
        $('#text-popup').enhanceWithin().popup();
        $('#logout-popup').enhanceWithin().popup();
        $('#removeRole-popup').enhanceWithin().popup();
        $('#deleteRole-popup').enhanceWithin().popup();
        $('#removePermission-popup').enhanceWithin().popup();
    });
};

function onPause() {
    // TODO: This application has been suspended. Save application state here.
};

function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
};