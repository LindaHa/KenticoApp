"use strict";

var authentication_api_url = system_api_domain + "/kenticoapi/authentication/";

function getCurrentUserApiCall(success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authentication_api_url + 'get-current-user',
        type: 'GET',
        success: function (response) {
            if (success_callback) success_callback(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

function authenticateUserApiCall(username, password, success_callback) {
    showCustomLoadingMessage();
    access_token = null;
    $('.user-profile-btn').text('Dearest');
    $.ajax({
        url: authentication_api_url + "authenticate-user",
        type: 'POST',
        dataType: "json",
        data: {
            username: username,
            password: password
        },
        success: function (data) {
            access_token = data.token.Code;
            if (success_callback) success_callback(data);
            getCurrentUserApiCall(function (data) {
                $('.user-profile-btn').text(data.UserName);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

function signOutUserApiCall(success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authentication_api_url + "sign-out-user",
        type: 'POST',
        dataType: "json",
        success: function (data) {
            access_token = null;
            if (success_callback) success_callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

function addListenersToLogoutBtn(){
    $('#logUserOutYes-btn').on('click', function () {
        signOutUserApiCall();
    });
}

function addListenersToLoginForm() {
    $('#login-btn').on('click', function(){
        authenticateUserApiCall($('#usrname-input').val(), $('#passwrd-input').val(), function () {
            $.mobile.changePage("#menu-page");
        });
    });
}